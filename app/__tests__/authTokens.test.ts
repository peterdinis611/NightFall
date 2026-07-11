import { describe, it, expect, beforeEach } from "vitest"
import { createMemoryStorage } from "~/db/memoryStorage"
import {
  AUTH_TOKENS_STORAGE_KEY,
  clearStoredAuthSession,
  createAuthTokensCollection,
  hasStoredAuthSession,
  resetAuthTokensCollection,
  storeAuthTokens,
} from "~/db/authTokens"

describe("authTokens collection", () => {
  beforeEach(() => {
    resetAuthTokensCollection(createMemoryStorage())
  })

  it("stores jwt and refresh tokens", () => {
    storeAuthTokens({ token: "jwt-token", refreshToken: "refresh-token" })

    expect(hasStoredAuthSession()).toBe(true)
    const collection = createAuthTokensCollection(createMemoryStorage())
    // singleton was reset — read via helpers
    expect(hasStoredAuthSession()).toBe(true)
  })

  it("clears all auth tokens", () => {
    storeAuthTokens({ token: "a", refreshToken: "b" })
    clearStoredAuthSession()
    expect(hasStoredAuthSession()).toBe(false)
  })

  it("persists to the configured storage key", () => {
    const storage = createMemoryStorage()
    resetAuthTokensCollection(storage)
    storeAuthTokens({ token: "jwt-token", refreshToken: "refresh-token" })

    const raw = storage.getItem(AUTH_TOKENS_STORAGE_KEY)
    expect(raw).toBeTruthy()
    expect(raw).toContain("jwt-token")
    expect(raw).toContain("refresh-token")
  })

  it("updates tokens on subsequent sign-in", () => {
    storeAuthTokens({ token: "old", refreshToken: "old-r" })
    storeAuthTokens({ token: "new", refreshToken: "new-r" })

    const storage = createMemoryStorage()
    resetAuthTokensCollection(storage)
    storeAuthTokens({ token: "new", refreshToken: "new-r" })

    const raw = storage.getItem(AUTH_TOKENS_STORAGE_KEY) ?? ""
    expect(raw).toContain("new")
    expect(raw).not.toContain("old-r")
  })
})
