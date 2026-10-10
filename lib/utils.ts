import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).format(new Date(ts))
}

export function wordCount(text: string) {
  return text.trim().split(/\s+/).length
}

export function readingMs(words: number, wpm = 200) {
  return Math.round((words / wpm) * 60 * 1000)
}

// Mood → gradient colour pair [from, to] for background
export const MOOD_COLORS: Record<string, [string, string]> = {
  fog:      ["#1a2035", "#2d3555"],
  silence:  ["#050508", "#0a0a10"],
  dread:    ["#0d0918", "#1a0a2e"],
  descent:  ["#0a0510", "#1a0518"],
  static:   ["#0a0a10", "#151520"],
  pulse:    ["#1a0308", "#2d050d"],
  chase:    ["#0a0308", "#1f0510"],
  reveal:   ["#0c0c14", "#1a1a28"],
}

// Mood → label for UI
export const MOOD_LABELS: Record<string, string> = {
  fog:      "Fog",
  silence:  "Silence",
  dread:    "Dread",
  descent:  "Descent",
  static:   "Static",
  pulse:    "Pulse",
  chase:    "Chase",
  reveal:   "Reveal",
}
