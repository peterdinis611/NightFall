"use client"

import { useEffect, useRef } from "react"

type SceneNarrationProps = {
  text: string
  enabled: boolean
  /** Restart when scene index changes */
  sceneKey: string | number
}

/**
 * Soft browser TTS — whisper-ish rate/pitch. Opt-in only.
 */
export function SceneNarration({ text, enabled, sceneKey }: SceneNarrationProps) {
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()
    utterRef.current = null

    if (!enabled || !text.trim()) return

    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.88
    utter.pitch = 0.75
    utter.volume = 0.7

    const voices = window.speechSynthesis.getVoices()
    const preferred =
      voices.find((v) => /en(-|_)?GB/i.test(v.lang) && /female|samantha|serena|moira/i.test(v.name)) ||
      voices.find((v) => /^en/i.test(v.lang)) ||
      null
    if (preferred) utter.voice = preferred

    utterRef.current = utter
    // Voices sometimes load async
    const speak = () => window.speechSynthesis.speak(utter)
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const later = window.speechSynthesis.getVoices()
        const v = later.find((x) => /^en/i.test(x.lang))
        if (v) utter.voice = v
        speak()
        window.speechSynthesis.onvoiceschanged = null
      }
    } else {
      speak()
    }

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [enabled, text, sceneKey])

  return null
}

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window
}
