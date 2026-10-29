import { describe, expect, it } from "vitest"
import { sanitizeGenerationError } from "@/lib/sanitizeError"

describe("sanitizeGenerationError", () => {
  it("uses fallback for empty input", () => {
    expect(sanitizeGenerationError(null)).toMatch(/retry from your library/i)
    expect(sanitizeGenerationError("")).toMatch(/retry from your library/i)
  })

  it("hides API key leaks", () => {
    expect(sanitizeGenerationError("OPENAI_API_KEY is not set")).toMatch(
      /not configured/i,
    )
  })

  it("maps rate / quota noise", () => {
    expect(sanitizeGenerationError("429 Too Many Requests")).toMatch(/busy/i)
    expect(sanitizeGenerationError("quota exceeded")).toMatch(/busy/i)
  })

  it("maps timeouts", () => {
    expect(sanitizeGenerationError("ETIMEDOUT")).toMatch(/timed out/i)
  })

  it("maps malformed payloads", () => {
    expect(sanitizeGenerationError("Unexpected JSON")).toMatch(/malformed/i)
  })

  it("hides stack traces and long dumps", () => {
    expect(sanitizeGenerationError("boom\n  at handler (x.js:1)")).toMatch(
      /something went wrong/i,
    )
    expect(sanitizeGenerationError("x".repeat(200))).toMatch(/something went wrong/i)
  })

  it("passes short safe messages through", () => {
    expect(sanitizeGenerationError("The ritual failed")).toBe("The ritual failed")
  })
})
