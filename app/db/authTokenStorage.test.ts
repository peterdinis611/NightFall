import { describe, it, expect, beforeEach } from "vitest"
import { createMemoryStorage } from "./memoryStorage"
import { createAuthTokenStorage } from "./authTokenStorage"
import { createAuthTokensCollection, resetAuthTokensCollection } from "./authTokens"

describe("createAuthTokenStorage", () => {
  beforeEach(() => {
    resetAuthTokensCollection(createMemoryStorage())
  })

  it("maps Convex Auth JWT key to TanStack DB collection", () => {
    const collection = createAuthTokensCollection(createMemoryStorage())
    const storage = createAuthTokenStorage(collection)

    storage.setItem("__convexAuthJWT", "test-jwt")
    expect(storage.getItem("__convexAuthJWT")).toBe("test-jwt")
    expect(collection.get("jwt")?.value).toBe("test-jwt")
  })

  it("maps refresh token key", () => {
    const collection = createAuthTokensCollection(createMemoryStorage())
    const storage = createAuthTokenStorage(collection)

    storage.setItem("__convexAuthRefreshToken", "test-refresh")
    expect(storage.getItem("__convexAuthRefreshToken")).toBe("test-refresh")
    expect(collection.get("refresh")?.value).toBe("test-refresh")
  })

  it("removes tokens", () => {
    const collection = createAuthTokensCollection(createMemoryStorage())
    const storage = createAuthTokenStorage(collection)

    storage.setItem("__convexAuthJWT", "test-jwt")
    storage.removeItem("__convexAuthJWT")
    expect(storage.getItem("__convexAuthJWT")).toBeNull()
    expect(collection.has("jwt")).toBe(false)
  })

  it("updates existing token values", () => {
    const collection = createAuthTokensCollection(createMemoryStorage())
    const storage = createAuthTokenStorage(collection)

    storage.setItem("__convexAuthJWT", "v1")
    storage.setItem("__convexAuthJWT", "v2")
    expect(storage.getItem("__convexAuthJWT")).toBe("v2")
  })
})
