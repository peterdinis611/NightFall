// @ts-nocheck
import { query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"
import type { Id } from "./_generated/dataModel"
import type { MutationCtx, QueryCtx } from "./_generated/server"

/** Tunable limits — guests are stricter (anonymous accounts are cheap to mint). */
export const RATE_LIMITS = {
  signedIn: {
    cooldownMs: 20_000,
    hourlyMax: 5,
    dailyMax: 25,
    maxGenerating: 1,
    retryHourlyMax: 8,
  },
  guest: {
    cooldownMs: 45_000,
    hourlyMax: 3,
    dailyMax: 10,
    maxGenerating: 1,
    retryHourlyMax: 4,
  },
} as const

type LimitProfile = (typeof RATE_LIMITS)["signedIn"]

export type RateLimitKind = "create" | "retry"

export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryAfterMs?: number,
  ) {
    super(message)
    this.name = "RateLimitError"
  }
}

function profileFor(isAnonymous: boolean): LimitProfile {
  return isAnonymous ? RATE_LIMITS.guest : RATE_LIMITS.signedIn
}

function formatWait(ms: number): string {
  const sec = Math.ceil(ms / 1000)
  if (sec < 60) return `${sec}s`
  const min = Math.ceil(sec / 60)
  if (min < 60) return `${min} min`
  const hr = Math.ceil(min / 60)
  return `${hr}h`
}

async function loadUser(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
) {
  const user = await ctx.db.get(userId)
  return {
    isAnonymous: Boolean(user?.isAnonymous),
    limits: profileFor(Boolean(user?.isAnonymous)),
  }
}

async function storiesSince(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  since: number,
) {
  return ctx.db
    .query("stories")
    .withIndex("by_user", (q) => q.eq("userId", userId).gte("createdAt", since))
    .collect()
}

/**
 * Enforce create limits. Throws RateLimitError with a user-facing message.
 */
export async function assertCanCreateStory(
  ctx: MutationCtx,
  userId: Id<"users">,
) {
  const now = Date.now()
  const { isAnonymous, limits } = await loadUser(ctx, userId)
  const dayAgo = now - 24 * 60 * 60 * 1000
  const hourAgo = now - 60 * 60 * 1000

  const recentDay = await storiesSince(ctx, userId, dayAgo)
  const recentHour = recentDay.filter((s) => s.createdAt >= hourAgo)
  const generating = recentDay.filter((s) => s.status === "generating")

  if (generating.length >= limits.maxGenerating) {
    throw new RateLimitError(
      "A story is already generating. Wait for it to finish before summoning another.",
      "GENERATING_IN_FLIGHT",
    )
  }

  if (recentDay.length >= limits.dailyMax) {
    const oldest = recentDay.reduce((a, b) => (a.createdAt < b.createdAt ? a : b))
    const retryAfterMs = oldest.createdAt + 24 * 60 * 60 * 1000 - now
    throw new RateLimitError(
      `Daily limit reached (${limits.dailyMax}/day${isAnonymous ? " for guests" : ""}). Try again in ${formatWait(retryAfterMs)}.`,
      "DAILY_LIMIT",
      Math.max(retryAfterMs, 0),
    )
  }

  if (recentHour.length >= limits.hourlyMax) {
    const oldest = recentHour.reduce((a, b) => (a.createdAt < b.createdAt ? a : b))
    const retryAfterMs = oldest.createdAt + 60 * 60 * 1000 - now
    throw new RateLimitError(
      `Hourly limit reached (${limits.hourlyMax}/hour${isAnonymous ? " for guests" : ""}). Try again in ${formatWait(retryAfterMs)}.`,
      "HOURLY_LIMIT",
      Math.max(retryAfterMs, 0),
    )
  }

  const newest = recentDay.length
    ? recentDay.reduce((a, b) => (a.createdAt > b.createdAt ? a : b))
    : null

  if (newest) {
    const elapsed = now - newest.createdAt
    if (elapsed < limits.cooldownMs) {
      const retryAfterMs = limits.cooldownMs - elapsed
      throw new RateLimitError(
        `Slow down — wait ${formatWait(retryAfterMs)} before the next summon.`,
        "COOLDOWN",
        retryAfterMs,
      )
    }
  }
}

/**
 * Enforce retry limits (failed / stuck stories).
 */
export async function assertCanRetryGeneration(
  ctx: MutationCtx,
  userId: Id<"users">,
) {
  const now = Date.now()
  const { isAnonymous, limits } = await loadUser(ctx, userId)
  const hourAgo = now - 60 * 60 * 1000

  const recentHour = await storiesSince(ctx, userId, hourAgo)
  const generating = recentHour.filter((s) => s.status === "generating")

  if (generating.length >= limits.maxGenerating) {
    throw new RateLimitError(
      "A story is already generating. Wait for it to finish before retrying.",
      "GENERATING_IN_FLIGHT",
    )
  }

  // Count retries loosely: failed stories touched in the last hour + generating patches
  // Use stories created in the hour as proxy + failed ones being retried often
  // Better: count how many times user hit retry — we don't store that, so use
  // failed→generating churn: number of failed stories in the last hour is weak.
  // Instead: any create OR retry shares hourly create budget for guests; for retries
  // use a dedicated counter via failed stories updated recently.

  const newest = recentHour.length
    ? recentHour.reduce((a, b) => (a.createdAt > b.createdAt ? a : b))
    : null
  if (newest) {
    const elapsed = now - (newest.generatedAt ?? newest.createdAt)
    // Prefer createdAt for cooldown on retry of same story — use now vs last story activity
    const since = now - newest.createdAt
    if (since < limits.cooldownMs) {
      const retryAfterMs = limits.cooldownMs - since
      throw new RateLimitError(
        `Slow down — wait ${formatWait(retryAfterMs)} before retrying.`,
        "COOLDOWN",
        retryAfterMs,
      )
    }
  }

  // Cap retries: count stories currently failed that were created this hour
  // plus a soft cap using hourlyMax * 2 as retryHourlyMax on "generating" schedules
  // Approximate: if user has hit hourly create max, also block aggressive retries
  if (recentHour.length >= limits.retryHourlyMax) {
    throw new RateLimitError(
      `Too many generation attempts this hour (${limits.retryHourlyMax}${isAnonymous ? ", guest limit" : ""}). Try again later.`,
      "RETRY_HOURLY_LIMIT",
    )
  }
}

export async function getRateLimitSnapshot(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
) {
  const now = Date.now()
  const { isAnonymous, limits } = await loadUser(ctx, userId)
  const dayAgo = now - 24 * 60 * 60 * 1000
  const hourAgo = now - 60 * 60 * 1000
  const recentDay = await storiesSince(ctx, userId, dayAgo)
  const recentHour = recentDay.filter((s) => s.createdAt >= hourAgo)
  const generating = recentDay.some((s) => s.status === "generating")
  const newest = recentDay.length
    ? recentDay.reduce((a, b) => (a.createdAt > b.createdAt ? a : b))
    : null

  const cooldownRemainingMs = newest
    ? Math.max(0, limits.cooldownMs - (now - newest.createdAt))
    : 0

  return {
    isAnonymous,
    limits: {
      cooldownMs: limits.cooldownMs,
      hourlyMax: limits.hourlyMax,
      dailyMax: limits.dailyMax,
    },
    used: {
      hourly: recentHour.length,
      daily: recentDay.length,
    },
    remaining: {
      hourly: Math.max(0, limits.hourlyMax - recentHour.length),
      daily: Math.max(0, limits.dailyMax - recentDay.length),
    },
    cooldownRemainingMs,
    generating,
    canCreate:
      !generating &&
      cooldownRemainingMs === 0 &&
      recentHour.length < limits.hourlyMax &&
      recentDay.length < limits.dailyMax,
  }
}

/** Client-facing status for the generate form */
export const status = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    return getRateLimitSnapshot(ctx, userId)
  },
})
