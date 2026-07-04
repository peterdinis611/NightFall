"use client"
import { useEffect, useRef } from "react"

const AUDIO_MAP: Record<string, string> = {
  wind_low:        "/audio/wind_low.mp3",
  heartbeat_low:   "/audio/heartbeat_low.mp3",
  heartbeat_high:  "/audio/heartbeat_high.mp3",
  static_burst:    "/audio/static_burst.mp3",
  drip_cave:       "/audio/drip_cave.mp3",
  choir_dissonant: "/audio/choir_dissonant.mp3",
  chase_strings:   "/audio/chase_strings.mp3",
  silence:         "",
  breathing_close: "/audio/breathing_close.mp3",
  deep_drone:      "/audio/deep_drone.mp3",
  door_creak:      "/audio/door_creak.mp3",
  water_distant:   "/audio/water_distant.mp3",
}

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
    const src = AUDIO_MAP[soundCue] ?? ""
    if (!enabled || !src) {
      fadeOut(aRef.current)
      fadeOut(bRef.current)
      return
    }

    const next = activeRef.current === "a" ? bRef : aRef
    const prev = activeRef.current === "a" ? aRef : bRef
    activeRef.current = activeRef.current === "a" ? "b" : "a"

    // Prepare next element
    const el = new Audio(src)
    el.loop   = true
    el.volume = 0
    next.current = el

    el.play().catch(() => {})
    fadeIn(el, 2000)
    fadeOut(prev.current, 2000)

    return () => {
      fadeOut(el, 500)
    }
  }, [soundCue, enabled])

  return null
}

function fadeIn(el: HTMLAudioElement | null, ms = 1500) {
  if (!el) return
  const steps = 20
  const delta  = 0.35 / steps
  let   v      = 0
  const id = setInterval(() => {
    v = Math.min(v + delta, 0.35)
    el.volume = v
    if (v >= 0.35) clearInterval(id)
  }, ms / steps)
}

function fadeOut(el: HTMLAudioElement | null, ms = 1500) {
  if (!el) return
  const steps = 20
  const delta  = el.volume / steps
  const id = setInterval(() => {
    el.volume = Math.max(el.volume - delta, 0)
    if (el.volume <= 0) {
      clearInterval(id)
      el.pause()
      el.src = ""
    }
  }, ms / steps)
}
