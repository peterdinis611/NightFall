import { describe, expect, it } from "vitest"
import { createStorySchema, retryStorySchema } from "@/lib/storySchemas"

describe("createStorySchema", () => {
  const base = {
    prompt: "The lights flicker twice.",
    tone: "atmospheric" as const,
    length: "short" as const,
  }

  it("accepts a valid payload", () => {
    const parsed = createStorySchema.parse(base)
    expect(parsed.prompt).toBe(base.prompt)
    expect(parsed.theme).toBe("")
  })

  it("trims prompt and theme", () => {
    const parsed = createStorySchema.parse({
      ...base,
      prompt: "  knock  ",
      theme: "  cellar  ",
    })
    expect(parsed.prompt).toBe("knock")
    expect(parsed.theme).toBe("cellar")
  })

  it("rejects empty prompt", () => {
    expect(() => createStorySchema.parse({ ...base, prompt: "   " })).toThrow(
      /Prompt is required/,
    )
  })

  it("rejects prompts over 400 chars", () => {
    expect(() =>
      createStorySchema.parse({ ...base, prompt: "a".repeat(401) }),
    ).toThrow(/400/)
  })

  it("rejects invalid tone", () => {
    expect(() =>
      createStorySchema.parse({ ...base, tone: "comedy" }),
    ).toThrow()
  })

  it("accepts optional parentStoryId", () => {
    const parsed = createStorySchema.parse({
      ...base,
      parentStoryId: "stories_123",
    })
    expect(parsed.parentStoryId).toBe("stories_123")
  })
})

describe("retryStorySchema", () => {
  it("requires storyId", () => {
    expect(() => retryStorySchema.parse({ storyId: "" })).toThrow(/Missing story id/)
    expect(retryStorySchema.parse({ storyId: " stories_1 " }).storyId).toBe(
      "stories_1",
    )
  })
})
