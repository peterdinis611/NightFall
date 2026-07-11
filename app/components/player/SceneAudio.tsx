"use client"
import { useEffect, useRef } from "react"
import { AUDIO_TRACKS } from "~/lib/audioTracks"
import { fadeIn, fadeOut } from "~/lib/audioFade"

interface Props {
  soundCue: string
  enabled: boolean
}

/**
 * Manages two HTMLAudioElement instances (A/B ping-pong) for seamless cross-fade
 * between scenes. No visible UI — just ambient sound management.
 */
export function SceneAudio({ soundCue, enabled }: Props) {
  const aRef = useRef<HTMLAudioElement | null>(null)
  const bRef = useRef<HTMLAudioElement | null>(null)
  const activeRef = useRef<"a" | "b">("a")

  useEffect(() => {
    const src = AUDIO_TRACKS[soundCue] ?? ""
    if (!enabled || !src) {
      fadeOut(aRef.current)
      fadeOut(bRef.current)
      return
    }

    const next = activeRef.current === "a" ? bRef : aRef
    const prev = activeRef.current === "a" ? aRef : bRef
    activeRef.current = activeRef.current === "a" ? "b" : "a"

    const el = new Audio(src)
    el.loop   = true
    el.volume = 0
    next.current = el

    el.play().catch(() => {})
    fadeIn(el, 0.35, 2000)
    fadeOut(prev.current, 2000)

    return () => {
      fadeOut(el, 500)
    }
  }, [soundCue, enabled])

  return null
}
