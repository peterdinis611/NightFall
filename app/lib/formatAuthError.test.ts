import { describe, it, expect } from "vitest"
import { formatAuthError } from "./formatAuthError"

describe("formatAuthError", () => {
  it("maps InvalidAccountId for sign in", () => {
    expect(formatAuthError(new Error("InvalidAccountId"), "signIn")).toMatch(
      /No account found/,
    )
  })

  it("maps InvalidSecret", () => {
    expect(formatAuthError(new Error("InvalidSecret"), "signIn")).toBe(
      "Incorrect password.",
    )
  })

  it("parses Convex wrapped errors", () => {
    const err = new Error(
      "[CONVEX A(auth:signIn)] Uncaught Error: InvalidAccountId\n  at handler",
    )
    expect(formatAuthError(err, "signIn")).toMatch(/No account found/)
  })

  it("maps JWT setup errors", () => {
    expect(formatAuthError(new Error("Missing JWT_PRIVATE_KEY"), "signUp")).toMatch(
      /auth:setup/,
    )
  })

  it("truncates very long messages", () => {
    const long = "x".repeat(200)
    expect(formatAuthError(new Error(long), "signIn")).toHaveLength(181)
    expect(formatAuthError(new Error(long), "signIn").endsWith("…")).toBe(true)
  })
})
