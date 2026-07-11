import { useCallback, useEffect, useRef } from "react"
import { fadeIn, fadeOut } from "~/lib/audioFade"
import { pickRandomTrack, randomTrackDurationMs } from "~/lib/audioTracks"

const CROSSFADE_MS = 2500
const BACKGROUND_VOLUME = 0.22

interface Props {
  enabled: boolean
}

/**
 * Randomly cycles through ambient horror tracks with cross-fades.
 */
export function RandomAmbientAudio({ enabled }: Props) {
  const aRef = useRef<HTMLAudioElement | null>(null)
  const bRef = useRef<HTMLAudioElement | null>(null)
  const activeRef = useRef<"a" | "b">("a")
  const currentSrcRef = useRef("")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const crossfadeTo = useCallback(
    (src: string) => {
      const next = activeRef.current === "a" ? bRef : aRef
      const prev = activeRef.current === "a" ? aRef : bRef
      activeRef.current = activeRef.current === "a" ? "b" : "a"
      currentSrcRef.current = src

      const el = new Audio(src)
      el.loop = true
      el.volume = 0
      next.current = el

      void el.play().catch(() => {})
      fadeIn(el, BACKGROUND_VOLUME, CROSSFADE_MS)
      fadeOut(prev.current, CROSSFADE_MS)
    },
    []
  )

  const scheduleNext = useCallback(() => {
    clearTimer()
    timerRef.current = setTimeout(() => {
      crossfadeTo(pickRandomTrack(currentSrcRef.current))
      scheduleNext()
    }, randomTrackDurationMs())
  }, [clearTimer, crossfadeTo])

  useEffect(() => {
    if (!enabled) {
      clearTimer()
      fadeOut(aRef.current, 800)
      fadeOut(bRef.current, 800)
      currentSrcRef.current = ""
      return
    }

    crossfadeTo(pickRandomTrack())
    scheduleNext()

    return () => {
      clearTimer()
      fadeOut(aRef.current, 500)
      fadeOut(bRef.current, 500)
      currentSrcRef.current = ""
    }
  }, [enabled, clearTimer, crossfadeTo, scheduleNext])

  return null
}
