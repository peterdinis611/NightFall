export type PendingPrompt = {
  prompt: string
  theme: string
  tone: "atmospheric" | "psychological" | "jumpscare" | "graphic"
  length: "short" | "medium" | "long"
}

const KEY = "nightfall-pending-prompt"

export function savePendingPrompt(draft: PendingPrompt) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(KEY, JSON.stringify(draft))
}

export function readPendingPrompt(): PendingPrompt | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PendingPrompt
  } catch {
    return null
  }
}

export function clearPendingPrompt() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(KEY)
}
