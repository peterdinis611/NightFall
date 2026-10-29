import { describe, it, expect } from "vitest"
import {
  classifyError,
  encodeRateLimitError,
  formatUserError,
  isNextRedirect,
  unwrapConvexError,
} from "@/lib/errors"

describe("errors", () => {
  it("unwraps Convex wrappers", () => {
    expect(
      unwrapConvexError(
        new Error("[CONVEX M(x)] Uncaught Error: Prompt is required\n  at handler"),
      ),
    ).toBe("Prompt is required")
  })

  it("strips Server Error prefixes", () => {
    expect(unwrapConvexError(new Error("Server Error: Unauthorized"))).toBe(
      "Unauthorized",
    )
  })

  it("classifies network failures", () => {
    expect(classifyError(new Error("Failed to fetch")).kind).toBe("network")
    expect(classifyError(new Error("NetworkError when attempting")).kind).toBe(
      "network",
    )
  })

  it("classifies auth failures", () => {
    expect(classifyError(new Error("Authentication required")).kind).toBe("auth")
    expect(classifyError(new Error("InvalidSecret")).kind).toBe("auth")
  })

  it("classifies not found", () => {
    expect(classifyError(new Error("Story does not exist")).kind).toBe("not_found")
  })

  it("formats structured rate limits for users", () => {
    expect(
      formatUserError(
        new Error("RATE_LIMIT|HOURLY_LIMIT|0|Hourly limit reached (3/hour for guests)."),
      ),
    ).toMatch(/Hourly limit/)
  })

  it("encodes rate limit payloads", () => {
    expect(encodeRateLimitError("DAILY", "Too many today", 5000)).toBe(
      "RATE_LIMIT|DAILY|5000|Too many today",
    )
  })

  it("detects Next.js redirects", () => {
    expect(isNextRedirect({ digest: "NEXT_REDIRECT;replace;/library;307;" })).toBe(
      true,
    )
    expect(isNextRedirect(new Error("nope"))).toBe(false)
  })
})
