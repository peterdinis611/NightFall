import { describe, expect, it } from "vitest"
import { cn, formatDate, readingMs, wordCount, MOOD_COLORS, MOOD_LABELS } from "@/lib/utils"

describe("utils", () => {
  describe("cn", () => {
    it("merges class names", () => {
      expect(cn("px-2", "py-1")).toContain("px-2")
      expect(cn("px-2", "px-4")).toBe("px-4")
    })
  })

  describe("wordCount", () => {
    it("counts words", () => {
      expect(wordCount("one two three")).toBe(3)
      expect(wordCount("  spaced   out  ")).toBe(2)
    })
  })

  describe("readingMs", () => {
    it("estimates reading time at 200 wpm by default", () => {
      expect(readingMs(200)).toBe(60_000)
      expect(readingMs(100)).toBe(30_000)
    })

    it("respects custom wpm", () => {
      expect(readingMs(100, 100)).toBe(60_000)
    })
  })

  describe("formatDate", () => {
    it("formats a timestamp", () => {
      const label = formatDate(Date.UTC(2024, 0, 15))
      expect(label).toMatch(/2024/)
      expect(label).toMatch(/Jan/)
    })
  })

  describe("mood maps", () => {
    it("covers the player moods", () => {
      for (const mood of [
        "fog",
        "silence",
        "dread",
        "descent",
        "static",
        "pulse",
        "chase",
        "reveal",
      ]) {
        expect(MOOD_COLORS[mood]).toHaveLength(2)
        expect(MOOD_LABELS[mood]).toBeTruthy()
      }
    })
  })
})
