import { describe, it, expect } from "vitest"
import { formatRateLimitError } from "@/lib/formatRateLimitError"

describe("formatRateLimitError", () => {
  it("extracts Convex-wrapped rate limit messages", () => {
    const err = new Error(
      "[CONVEX M(stories:createStoryShell)] Uncaught Error: Slow down — wait 20s before the next summon.\n  at handler",
    )
    expect(formatRateLimitError(err)).toMatch(/Slow down/)
  })

  it("returns null for unrelated errors", () => {
    expect(formatRateLimitError(new Error("Authentication required"))).toBeNull()
  })
})
