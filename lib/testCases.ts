import type { PendingPrompt } from "@/lib/pendingPrompt"

/** Curated cases for manual MVP testing — fill form in one click */
export const TEST_CASES: Array<
  PendingPrompt & { id: string; label: string; note: string }
> = [
  {
    id: "smoke-short",
    label: "Smoke · short",
    note: "Fastest path — guest auth + short story",
    prompt:
      "The night nurse swore the empty wing still answered the call bells. Tonight, bed 14 rang twice.",
    theme: "abandoned-hospital",
    tone: "atmospheric",
    length: "short",
  },
  {
    id: "lake-door",
    label: "Lake door",
    note: "Default medium atmospheric (matches placeholder vibe)",
    prompt:
      "We found a door at the bottom of the lake. The handle was warm. Something knocked from the other side — three times, then once more after we stopped listening.",
    theme: "deep-sea",
    tone: "atmospheric",
    length: "medium",
  },
  {
    id: "mirror",
    label: "Mirror · psych",
    note: "Psychological tone + haunted house",
    prompt:
      "My reflection stopped blinking when I did. Last night it mouthed a name I haven't used since childhood, then pointed behind me.",
    theme: "haunted-house",
    tone: "psychological",
    length: "medium",
  },
  {
    id: "woods-jump",
    label: "Woods · jump",
    note: "Jumpscare pacing check",
    prompt:
      "The trail cameras only catch stillness — except frame 408, where something stands too close to the lens, smiling with too many teeth.",
    theme: "something-in-woods",
    tone: "jumpscare",
    length: "short",
  },
  {
    id: "wrong-door-long",
    label: "Wrong door · long",
    note: "Longer generation / scene count",
    prompt:
      "Every door in the motel opens to the same hallway. Room 12 is the only one that shouldn't exist on the map, and someone keeps sliding notes under it with my handwriting.",
    theme: "wrong-door",
    tone: "psychological",
    length: "long",
  },
]

export function getTestCase(id: string) {
  return TEST_CASES.find((c) => c.id === id)
}
