import { beforeEach, describe, expect, it } from "vitest"
import {
  clearAccountClaim,
  readAccountClaim,
  saveAccountClaim,
} from "@/lib/accountClaim"

describe("accountClaim", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("returns null when empty", () => {
    expect(readAccountClaim()).toBeNull()
  })

  it("saves and reads a token", () => {
    saveAccountClaim("claim-token-123")
    expect(readAccountClaim()).toBe("claim-token-123")
  })

  it("clears the token", () => {
    saveAccountClaim("claim-token-123")
    clearAccountClaim()
    expect(readAccountClaim()).toBeNull()
  })

  it("overwrites previous token", () => {
    saveAccountClaim("old")
    saveAccountClaim("new")
    expect(readAccountClaim()).toBe("new")
  })
})
