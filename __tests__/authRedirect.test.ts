import { describe, it, expect } from "vitest"
import { getAuthRedirectPath } from "@/lib/authRedirect"

describe("getAuthRedirectPath", () => {
  it("defaults to home", () => {
    expect(getAuthRedirectPath()).toBe("/")
    expect(getAuthRedirectPath(undefined)).toBe("/")
  })

  it("allows known paths", () => {
    expect(getAuthRedirectPath("/library")).toBe("/library")
    expect(getAuthRedirectPath("/auth")).toBe("/auth")
    expect(getAuthRedirectPath("/generate")).toBe("/generate")
    expect(getAuthRedirectPath("/explore")).toBe("/explore")
    expect(getAuthRedirectPath("/")).toBe("/")
  })

  it("allows story slugs", () => {
    expect(getAuthRedirectPath("/story/my-tale")).toBe("/story/my-tale")
  })

  it("rejects unknown paths and open redirects", () => {
    expect(getAuthRedirectPath("/evil")).toBe("/")
    expect(getAuthRedirectPath("https://evil.com")).toBe("/")
    expect(getAuthRedirectPath("//evil.com")).toBe("/")
    expect(getAuthRedirectPath("/story/../admin")).toBe("/story/../admin")
  })

  it("treats empty string as home", () => {
    expect(getAuthRedirectPath("")).toBe("/")
    expect(getAuthRedirectPath(null)).toBe("/")
  })
})

