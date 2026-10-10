/** Pull a clean rate-limit message out of Convex client errors */
export function formatRateLimitError(err: unknown): string | null {
  const raw = err instanceof Error ? err.message : String(err)
  const nested = raw.includes("[CONVEX")
    ? raw.match(/Uncaught Error: ([^\n]+)/)?.[1] ?? raw
    : raw

  const markers = [
    "Rate limit",
    "Daily limit",
    "Hourly limit",
    "Slow down",
    "already generating",
    "Too many generation",
    "guest limit",
  ]

  if (markers.some((m) => nested.toLowerCase().includes(m.toLowerCase()))) {
    return nested.length > 220 ? `${nested.slice(0, 220)}…` : nested
  }

  return null
}
