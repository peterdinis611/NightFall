import { describe, it, expect, beforeEach } from "vitest"
import {
  clearStoredAuthSession,
  hasStoredAuthSession,
  namespacedAuthKey,
  storeAuthTokens,
} from "~/db/authTokens"

describe("authTokens localStorage session", () => {
  beforeEach(() => {
    clearStoredAuthSession()
  })

  it("stores jwt and refresh tokens under namespaced keys", () => {
    storeAuthTokens({ token: "jwt-token", refreshToken: "refresh-token" })
    expect(hasStoredAuthSession()).toBe(true)
    expect(localStorage.getItem(namespacedAuthKey("__convexAuthJWT"))).toBe("jwt-token")
  })

  it("clears all auth tokens", () => {
    storeAuthTokens({ token: "a", refreshToken: "b" })
    clearStoredAuthSession()
    expect(hasStoredAuthSession()).toBe(false)
  })

  it("updates tokens on subsequent sign-in", () => {
    storeAuthTokens({ token: "old", refreshToken: "old-r" })
    storeAuthTokens({ token: "new", refreshToken: "new-r" })
    expect(localStorage.getItem(namespacedAuthKey("__convexAuthJWT"))).toBe("new")
    expect(localStorage.getItem(namespacedAuthKey("__convexAuthRefreshToken"))).toBe("new-r")
  })
})
