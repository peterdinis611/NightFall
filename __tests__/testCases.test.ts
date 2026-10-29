import { describe, expect, it } from "vitest"
import {
  getTestCase,
  RECOMMENDED_DEMO_ID,
  TEST_CASES,
} from "@/lib/testCases"

describe("testCases", () => {
  it("has unique ids", () => {
    const ids = TEST_CASES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("recommended demo exists and is marked", () => {
    const demo = getTestCase(RECOMMENDED_DEMO_ID)
    expect(demo).toBeDefined()
    expect(demo?.recommended).toBe(true)
    expect(demo?.length).toBe("short")
  })

  it("returns undefined for unknown ids", () => {
    expect(getTestCase("nope")).toBeUndefined()
  })

  it("keeps prompts within create limits", () => {
    for (const tc of TEST_CASES) {
      expect(tc.prompt.trim().length).toBeGreaterThan(0)
      expect(tc.prompt.length).toBeLessThanOrEqual(400)
      expect(["atmospheric", "psychological", "jumpscare", "graphic"]).toContain(
        tc.tone,
      )
      expect(["short", "medium", "long"]).toContain(tc.length)
    }
  })
})
