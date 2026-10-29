import { describe, expect, it } from "vitest"
import { unwrapSafeActionResult } from "@/lib/safeActionResult"

describe("unwrapSafeActionResult", () => {
  it("returns data on success", () => {
    expect(unwrapSafeActionResult({ data: { ok: true } })).toEqual({ ok: true })
  })

  it("throws serverError", () => {
    expect(() =>
      unwrapSafeActionResult({ serverError: "Authentication required" }),
    ).toThrow("Authentication required")
  })

  it("throws when data is missing", () => {
    expect(() => unwrapSafeActionResult({})).toThrow("Action returned no data")
  })

  it("throws flattened validation field errors", () => {
    expect(() =>
      unwrapSafeActionResult({
        validationErrors: {
          prompt: { _errors: ["Prompt is required"] },
        },
      }),
    ).toThrow("Prompt is required")
  })

  it("throws form-level validation errors", () => {
    expect(() =>
      unwrapSafeActionResult({
        validationErrors: {
          _errors: ["Invalid input shape"],
        },
      }),
    ).toThrow("Invalid input shape")
  })
})
