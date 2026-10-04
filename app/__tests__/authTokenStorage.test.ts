import { describe, it, expect, beforeEach } from "vitest"
import { createAuthTokenStorage } from "~/db/authTokenStorage"
import {
  clearStoredAuthSession,
  hasStoredAuthSession,
  namespacedAuthKey,
  storeAuthTokens,
} from "~/db/authTokens"
import { createMemoryStorage } from "~/db/memoryStorage"

describe("createAuthTokenStorage", () => {
  it("passes namespaced keys through to underlying storage", () => {
    const mem = createMemoryStorage()
    const storage = createAuthTokenStorage(mem as unknown as Storage)
    const key = "__convexAuthJWT_httpsyourdeploymentconvexcloud"

    storage.setItem(key, "test-jwt")
    expect(storage.getItem(key)).toBe("test-jwt")
    storage.removeItem(key)
    expect(storage.getItem(key)).toBeNull()
  })
})

describe("auth token helpers", () => {
  beforeEach(() => {
    clearStoredAuthSession()
  })

  it("stores and detects a namespaced session", () => {
    storeAuthTokens({ token: "jwt-abc", refreshToken: "refresh-xyz" })
    expect(hasStoredAuthSession()).toBe(true)
    expect(localStorage.getItem(namespacedAuthKey("__convexAuthJWT"))).toBe("jwt-abc")
    expect(localStorage.getItem(namespacedAuthKey("__convexAuthRefreshToken"))).toBe(
      "refresh-xyz",
    )
  })

  it("clears the session", () => {
    storeAuthTokens({ token: "jwt-abc", refreshToken: "refresh-xyz" })
    clearStoredAuthSession()
    expect(hasStoredAuthSession()).toBe(false)
  })
})
