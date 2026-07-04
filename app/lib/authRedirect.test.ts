import { describe, it, expect } from "vitest"
import { authNavigateOptions, getAuthRedirectPath } from "./authRedirect"

describe("getAuthRedirectPath", () => {
  it("defaults to home", () => {
    expect(getAuthRedirectPath()).toBe("/")
    expect(getAuthRedirectPath(undefined)).toBe("/")
  })

  it("allows known paths", () => {
    expect(getAuthRedirectPath("/library")).toBe("/library")
    expect(getAuthRedirectPath("/auth")).toBe("/auth")
  })

  it("allows story slugs", () => {
    expect(getAuthRedirectPath("/story/my-tale")).toBe("/story/my-tale")
  })

  it("rejects unknown paths", () => {
    expect(getAuthRedirectPath("/evil")).toBe("/")
    expect(getAuthRedirectPath("https://evil.com")).toBe("/")
  })
})

describe("authNavigateOptions", () => {
  it("builds story route params", () => {
    expect(authNavigateOptions("/story/haunted-house")).toEqual({
      to: "/story/$slug",
      params: { slug: "haunted-house" },
    })
  })

  it("builds static routes", () => {
    expect(authNavigateOptions("/library")).toEqual({ to: "/library" })
    expect(authNavigateOptions("/")).toEqual({ to: "/" })
  })
})
