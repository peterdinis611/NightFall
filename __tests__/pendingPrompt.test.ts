import { beforeEach, describe, expect, it } from "vitest"
import {
  clearPendingPrompt,
  readPendingPrompt,
  savePendingPrompt,
  type PendingPrompt,
} from "@/lib/pendingPrompt"

const draft: PendingPrompt = {
  prompt: "Something knocks three times.",
  theme: "wrong-door",
  tone: "psychological",
  length: "short",
  parentStoryId: "stories_abc",
}

describe("pendingPrompt", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("returns null when empty", () => {
    expect(readPendingPrompt()).toBeNull()
  })

  it("round-trips a draft including parentStoryId", () => {
    savePendingPrompt(draft)
    expect(readPendingPrompt()).toEqual(draft)
  })

  it("clears stored draft", () => {
    savePendingPrompt(draft)
    clearPendingPrompt()
    expect(readPendingPrompt()).toBeNull()
  })

  it("returns null on corrupt JSON", () => {
    sessionStorage.setItem("nightfall-pending-prompt", "{not-json")
    expect(readPendingPrompt()).toBeNull()
  })
})
