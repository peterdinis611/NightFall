import { describe, it, expect, beforeEach, vi } from "vitest"
import { createMemoryStorage } from "~/db/memoryStorage"
import {
  hasStoredAuthSession,
  resetAuthTokensCollection,
} from "~/db/authTokens"
import { callAuthSignIn, passwordSignIn } from "~/lib/credentialsSignIn"

describe("credentialsSignIn", () => {
  beforeEach(() => {
    resetAuthTokensCollection(createMemoryStorage())
    vi.restoreAllMocks()
  })

  it("stores tokens from a successful password sign-in", async () => {
    const mockClient = {
      action: vi.fn().mockResolvedValue({
        tokens: { token: "jwt-abc", refreshToken: "refresh-xyz" },
      }),
    }

    const assign = vi.fn()
    vi.stubGlobal("location", { ...window.location, assign })

    await passwordSignIn(
      { email: "user@test.com", password: "password123", flow: "signIn" },
      "/library",
      mockClient as never,
    )

    expect(mockClient.action).toHaveBeenCalledWith("auth:signIn", {
      provider: "password",
      params: {
        email: "user@test.com",
        password: "password123",
        flow: "signIn",
      },
    })
    expect(hasStoredAuthSession()).toBe(true)
    expect(assign).toHaveBeenCalled()
  })

  it("clears previous session before sign-in", async () => {
    resetAuthTokensCollection(createMemoryStorage())
    const storage = createMemoryStorage()
    resetAuthTokensCollection(storage)

    const { storeAuthTokens } = await import("~/db/authTokens")
    storeAuthTokens({ token: "old", refreshToken: "old-r" })

    const mockClient = {
      action: vi.fn().mockResolvedValue({
        tokens: { token: "new", refreshToken: "new-r" },
      }),
    }

    vi.stubGlobal("location", { ...window.location, assign: vi.fn() })

    await callAuthSignIn(
      "password",
      { email: "a@b.com", password: "password123", flow: "signIn" },
      mockClient as never,
    )

    expect(hasStoredAuthSession()).toBe(false)

    await passwordSignIn(
      { email: "a@b.com", password: "password123", flow: "signIn" },
      "/",
      mockClient as never,
    )

    expect(hasStoredAuthSession()).toBe(true)
  })

  it("throws when no tokens are returned", async () => {
    const mockClient = {
      action: vi.fn().mockResolvedValue({ tokens: null }),
    }

    await expect(
      passwordSignIn(
        { email: "a@b.com", password: "password123", flow: "signIn" },
        "/",
        mockClient as never,
      ),
    ).rejects.toThrow(/did not return a session/)
  })

  it("normalizes email to lowercase on sign-up", async () => {
    const mockClient = {
      action: vi.fn().mockResolvedValue({
        tokens: { token: "j", refreshToken: "r" },
      }),
    }

    vi.stubGlobal("location", { ...window.location, assign: vi.fn() })

    await passwordSignIn(
      {
        email: "User@Test.COM",
        password: "password123",
        flow: "signUp",
        name: "Peter",
      },
      "/",
      mockClient as never,
    )

    expect(mockClient.action).toHaveBeenCalledWith(
      "auth:signIn",
      expect.objectContaining({
        params: expect.objectContaining({
          email: "user@test.com",
          name: "Peter",
          flow: "signUp",
        }),
      }),
    )
  })
})
