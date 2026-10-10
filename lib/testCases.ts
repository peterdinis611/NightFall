import type { PendingPrompt } from "@/lib/pendingPrompt"

/** Curated cases for manual MVP testing — fill form (or fill + summon) in one click */
export const TEST_CASES: Array<
  PendingPrompt & {
    id: string
    label: string
    note: string
    /** Highlight as the default smoke path */
    recommended?: boolean
  }
> = [
  {
    id: "smoke-short",
    label: "▶ Smoke · short",
    note: "Odporúčané — guest + krátky príbeh (~30–60s)",
    recommended: true,
    prompt:
      "The night nurse swore the empty wing still answered the call bells. Tonight, bed 14 rang twice.",
    theme: "abandoned-hospital",
    tone: "atmospheric",
    length: "short",
  },
  {
    id: "lake-door",
    label: "Lake door",
    note: "Stredná atmospheric — dvere na dne jazera",
    prompt:
      "We found a door at the bottom of the lake. The handle was warm. Something knocked from the other side — three times, then once more after we stopped listening.",
    theme: "deep-sea",
    tone: "atmospheric",
    length: "medium",
  },
  {
    id: "mirror",
    label: "Mirror · psych",
    note: "Psychological tone — odraz, ktorý žije vlastný život",
    prompt:
      "My reflection stopped blinking when I did. Last night it mouthed a name I haven't used since childhood, then pointed behind me.",
    theme: "haunted-house",
    tone: "psychological",
    length: "medium",
  },
  {
    id: "woods-jump",
    label: "Woods · jump",
    note: "Jumpscare pacing — trail camera",
    prompt:
      "The trail cameras only catch stillness — except frame 408, where something stands too close to the lens, smiling with too many teeth.",
    theme: "something-in-woods",
    tone: "jumpscare",
    length: "short",
  },
  {
    id: "motel-notes",
    label: "Motel · psych",
    note: "Wrong door + psych — poznámky v tvojom písme",
    prompt:
      "Every door in the motel opens to the same hallway. Room 12 is the only one that shouldn't exist on the map, and someone keeps sliding notes under it with my handwriting.",
    theme: "wrong-door",
    tone: "psychological",
    length: "medium",
  },
  {
    id: "urban-legend",
    label: "Radio · urban",
    note: "Urban legend — nočná frekvencia",
    prompt:
      "At 3:13 a.m. the car radio locks onto a station that only says my full name, then lists the exits I already passed. The fuel gauge drops when I try to turn around.",
    theme: "urban-legend",
    tone: "atmospheric",
    length: "short",
  },
  {
    id: "graphic-short",
    label: "Graphic · short",
    note: "18+ graphic tone check (krátky)",
    prompt:
      "The freezer in the staff kitchen hummed a lullaby. Inside, someone had arranged the meat into a perfect circle of faces — and one of them was still warm.",
    theme: "last-survivor",
    tone: "graphic",
    length: "short",
  },
  {
    id: "wrong-door-long",
    label: "Wrong door · long",
    note: "Dlhší run — viac scén, pomalšie (~2–3 min)",
    prompt:
      "Every door in the motel opens to the same hallway. Room 12 is the only one that shouldn't exist on the map, and someone keeps sliding notes under it with my handwriting. The handwriting gets better each night.",
    theme: "wrong-door",
    tone: "psychological",
    length: "long",
  },
]

export function getTestCase(id: string) {
  return TEST_CASES.find((c) => c.id === id)
}

export const RECOMMENDED_DEMO_ID = "smoke-short"
