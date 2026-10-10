"use client"

import { useEffect, useState } from "react"

type RateLimitSnapshot = {
  cooldownRemainingMs: number
  canCreate: boolean
  generating: boolean
  remaining: { hourly: number; daily: number }
  limits: { hourlyMax: number; dailyMax: number; cooldownMs: number }
  isAnonymous: boolean
  /** Server timestamp when snapshot was computed */
  serverNow?: number
} | null | undefined

/**
 * Tick cooldown locally between Convex reactive updates so the UI
 * doesn't depend on re-querying every second.
 */
export function useRateLimitClock(snapshot: RateLimitSnapshot) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!snapshot || snapshot.cooldownRemainingMs <= 0) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [snapshot?.cooldownRemainingMs, snapshot?.canCreate])

  if (!snapshot) {
    return {
      cooldownSec: 0,
      canCreate: true,
      label: null as string | null,
      blockedReason: null as string | null,
    }
  }

  const base = snapshot.serverNow ?? Date.now()
  const elapsedSinceSnapshot = Math.max(0, now - base)
  const cooldownMs = Math.max(0, snapshot.cooldownRemainingMs - elapsedSinceSnapshot)
  const cooldownSec = Math.ceil(cooldownMs / 1000)
  const canCreate =
    snapshot.canCreate && !snapshot.generating && cooldownMs === 0

  let blockedReason: string | null = null
  if (snapshot.generating) {
    blockedReason = "A story is already generating — wait for it to finish."
  } else if (cooldownSec > 0) {
    blockedReason = `Cooldown — wait ${cooldownSec}s before the next summon.`
  } else if (snapshot.remaining.hourly <= 0) {
    blockedReason = `Hourly limit reached (${snapshot.limits.hourlyMax}/hour).`
  } else if (snapshot.remaining.daily <= 0) {
    blockedReason = `Daily limit reached (${snapshot.limits.dailyMax}/day).`
  }

  const label = snapshot.generating
    ? "a story is already in the dark — wait for it"
    : cooldownSec > 0
      ? `cooldown ${cooldownSec}s · ${snapshot.remaining.hourly}/${snapshot.limits.hourlyMax} left this hour`
      : `${snapshot.remaining.hourly}/${snapshot.limits.hourlyMax} summons left this hour · ${snapshot.remaining.daily} today${
          snapshot.isAnonymous ? " · guest" : ""
        }`

  return { cooldownSec, canCreate, label, blockedReason }
}
