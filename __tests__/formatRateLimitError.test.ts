import { describe, it, expect } from "vitest"
import { formatRateLimitError, getRateLimitRetryMs } from "@/lib/formatRateLimitError"

describe("formatRateLimitError", () => {
  it("extracts Convex-wrapped rate limit messages", () => {
    const err = new Error(
      "[CONVEX M(stories:createStoryShell)] Uncaught Error: Slow down — wait 20s before the next summon.\n  at handler",
    )
    expect(formatRateLimitError(err)).toMatch(/Slow down/)
  })

  it("parses structured RATE_LIMIT payloads", () => {
    const err = new Error(
      "[CONVEX M(stories:createStoryShell)] Uncaught Error: RATE_LIMIT|COOLDOWN|20000|Slow down — wait 20s before the next summon.",
    )
    expect(formatRateLimitError(err)).toBe("Slow down — wait 20s before the next summon.")
    expect(getRateLimitRetryMs(err)).toBe(20000)
  })

  it("returns null for unrelated errors", () => {
    expect(formatRateLimitError(new Error("Authentication required"))).toBeNull()
  })
})
