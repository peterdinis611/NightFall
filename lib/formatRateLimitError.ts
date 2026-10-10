import { classifyError, parseRateLimitPayload, unwrapConvexError } from "@/lib/errors"

/** Pull a clean rate-limit message out of Convex client errors */
export function formatRateLimitError(err: unknown): string | null {
  const message = unwrapConvexError(err)
  const parsed = parseRateLimitPayload(message)
  if (parsed) return parsed.message
  const classified = classifyError(err)
  return classified.kind === "rate_limit" ? classified.message : null
}

export function getRateLimitRetryMs(err: unknown): number | undefined {
  return parseRateLimitPayload(unwrapConvexError(err))?.retryAfterMs
}
