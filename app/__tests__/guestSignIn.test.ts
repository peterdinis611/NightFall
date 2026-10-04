import { describe, it, expect, beforeEach, vi } from "vitest"
import { clearStoredAuthSession, hasStoredAuthSession } from "~/db/authTokens"

describe("establishGuestSession", () => {
  beforeEach(() => {
    clearStoredAuthSession()
    vi.restoreAllMocks()
  })

  it("stores tokens and hard-reloads", async () => {
    const assign = vi.fn()
    vi.stubGlobal("location", { ...window.location, assign, origin: "http://localhost:3000" })

    vi.doMock("convex/browser", () => ({
      ConvexHttpClient: class {
        action = vi.fn().mockResolvedValue({
          tokens: { token: "jwt-guest", refreshToken: "refresh-guest" },
        })
      },
    }))

    const { establishGuestSession } = await import("~/lib/guestSignIn")
    await establishGuestSession("/#generate")

    expect(hasStoredAuthSession()).toBe(true)
    expect(assign).toHaveBeenCalledWith("http://localhost:3000/#generate")
  })
})
