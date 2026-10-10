import { describe, it, expect } from "vitest"
import { classifyError, formatUserError, unwrapConvexError } from "@/lib/errors"

describe("errors", () => {
  it("unwraps Convex wrappers", () => {
    expect(
      unwrapConvexError(
        new Error("[CONVEX M(x)] Uncaught Error: Prompt is required\n  at handler"),
      ),
    ).toBe("Prompt is required")
  })

  it("classifies network failures", () => {
    expect(classifyError(new Error("Failed to fetch")).kind).toBe("network")
  })

  it("formats structured rate limits for users", () => {
    expect(
      formatUserError(
        new Error("RATE_LIMIT|HOURLY_LIMIT|0|Hourly limit reached (3/hour for guests)."),
      ),
    ).toMatch(/Hourly limit/)
  })
})
