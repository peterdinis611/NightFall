/** Shared error unwrapping for Convex + Next Server Actions */

export type AppErrorKind =
  | "rate_limit"
  | "auth"
  | "validation"
  | "network"
  | "not_found"
  | "unknown"

export type ClassifiedError = {
  kind: AppErrorKind
  message: string
  code?: string
  retryAfterMs?: number
}

const RATE_PREFIX = "RATE_LIMIT|"

export function isNextRedirect(err: unknown): boolean {
  return String((err as { digest?: string })?.digest ?? "").startsWith("NEXT_REDIRECT")
}

/** Strip Convex client wrappers: `[CONVEX …] Uncaught Error: …` */
export function unwrapConvexError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  if (raw.includes("[CONVEX")) {
    return raw.match(/Uncaught Error: ([^\n]+)/)?.[1]?.trim() ?? raw
  }
  if (raw.includes("Server Error:")) {
    return raw.replace(/^Server Error:\s*/i, "").trim()
  }
  return raw.trim()
}

export function parseRateLimitPayload(message: string): ClassifiedError | null {
  if (message.startsWith(RATE_PREFIX)) {
    const [, code, retryRaw, ...rest] = message.split("|")
    const retryAfterMs = Number(retryRaw)
    return {
      kind: "rate_limit",
      code,
      retryAfterMs: Number.isFinite(retryAfterMs) ? retryAfterMs : undefined,
      message: rest.join("|") || "Rate limit reached. Try again later.",
    }
  }

  const markers = [
    "daily limit",
    "hourly limit",
    "slow down",
    "already generating",
    "too many generation",
    "guest limit",
    "rate limit",
  ]
  const lower = message.toLowerCase()
  if (markers.some((m) => lower.includes(m))) {
    return { kind: "rate_limit", message }
  }
  return null
}

export function classifyError(err: unknown): ClassifiedError {
  const message = unwrapConvexError(err)

  const rate = parseRateLimitPayload(message)
  if (rate) return rate

  const lower = message.toLowerCase()

  if (
    lower === "failed to fetch" ||
    lower.includes("networkerror") ||
    lower.includes("load failed") ||
    lower.includes("network request failed")
  ) {
    return {
      kind: "network",
      message:
        "Connection failed. Check your network and open http://localhost:3000 (not another port).",
    }
  }

  if (
    lower.includes("authentication") ||
    lower.includes("unauthorized") ||
    lower.includes("invalidsecret") ||
    lower.includes("invalidaccountid") ||
    lower.includes("jwt_private_key")
  ) {
    return { kind: "auth", message }
  }

  if (
    lower.includes("prompt") ||
    lower.includes("required") ||
    lower.includes("zod") ||
    lower.includes("invalid")
  ) {
    // Keep validation-ish messages readable
    if (lower.includes("authentication required")) {
      return { kind: "auth", message: "Sign in or continue as guest first." }
    }
  }

  if (lower.includes("does not exist") || lower.includes("not found")) {
    return { kind: "not_found", message }
  }

  return {
    kind: "unknown",
    message: message.length > 200 ? `${message.slice(0, 200)}…` : message || "Something went wrong",
  }
}

export function formatUserError(err: unknown): string {
  return classifyError(err).message
}

/** Encode structured rate-limit errors thrown from Convex */
export function encodeRateLimitError(
  code: string,
  message: string,
  retryAfterMs?: number,
): string {
  return `${RATE_PREFIX}${code}|${retryAfterMs ?? 0}|${message}`
}
