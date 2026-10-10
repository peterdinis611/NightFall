"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { X, BookOpen, Home } from "lucide-react"
import { SceneBackground } from "./SceneBackground"
import { SceneText, type SceneTextHandle } from "./SceneText"
import { SceneAudio } from "./SceneAudio"
import { PlaybackBar } from "./PlaybackBar"
import { useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"

interface Scene {
  _id: string
  order: number
  text: string
  mood: "dread" | "chase" | "reveal" | "silence" | "descent" | "pulse" | "static" | "fog"
  soundCue: string
  imageUrl?: string | null
  readingMs: number
}

interface Props {
  storyId: Id<"stories">
  title: string
  scenes: Scene[]
  slug: string
}

const AUTO_PLAY_DELAY = 1200

export function StoryPlayer({ storyId, title, scenes, slug }: Props) {
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isRevealing, setIsRevealing] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [sessionId, setSessionId] = useState<Id<"playback_sessions"> | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [finished, setFinished] = useState(false)
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textRef = useRef<SceneTextHandle>(null)

  const recordPlay = useMutation(api.stories.recordPlay)
  const updatePlay = useMutation(api.stories.updatePlaySession)

  const scene = scenes[currentIdx]

  const clearAuto = useCallback(() => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
  }, [])

  const exitStory = useCallback(() => {
    clearAuto()
    router.push("/library")
  }, [router, clearAuto])

  useEffect(() => {
    recordPlay({ storyId })
      .then((id) => setSessionId(id ?? null))
      .catch(() => {})
  }, [storyId, recordPlay])

  useEffect(() => {
    if (!sessionId) return
    const completed = currentIdx === scenes.length - 1 && !isRevealing
    updatePlay({ sessionId, sceneReached: currentIdx, completed }).catch(() => {})
  }, [currentIdx, isRevealing, sessionId, scenes.length, updatePlay])

  const goNext = useCallback(() => {
    clearAuto()
    if (isRevealing) {
      textRef.current?.skip()
      return
    }
    if (currentIdx >= scenes.length - 1) {
      setFinished(true)
      return
    }
    setFinished(false)
    setCurrentIdx((i) => i + 1)
    setIsRevealing(true)
  }, [isRevealing, currentIdx, scenes.length])

  const goPrev = useCallback(() => {
    if (currentIdx === 0) return
    clearAuto()
    setFinished(false)
    setCurrentIdx((i) => i - 1)
    setIsRevealing(true)
  }, [currentIdx])

  const jumpTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= scenes.length || index === currentIdx) return
      clearAuto()
      setFinished(false)
      setCurrentIdx(index)
      setIsRevealing(true)
    },
    [currentIdx, scenes.length],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        exitStory()
        return
      }
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        goNext()
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      }
      if (e.key === "a" || e.key === "A") setAutoPlay((v) => !v)
      if (e.key === "m" || e.key === "M") setAudioEnabled((v) => !v)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goNext, goPrev, exitStory])

  const handleRevealComplete = useCallback(() => {
    setIsRevealing(false)
    if (autoPlay && currentIdx < scenes.length - 1) {
      autoTimerRef.current = setTimeout(() => {
        setCurrentIdx((i) => i + 1)
        setIsRevealing(true)
      }, AUTO_PLAY_DELAY)
    } else if (autoPlay && currentIdx >= scenes.length - 1) {
      setFinished(true)
    }
  }, [autoPlay, currentIdx, scenes.length])

  useEffect(() => {
    if (autoPlay && !isRevealing && currentIdx < scenes.length - 1) {
      autoTimerRef.current = setTimeout(() => {
        setCurrentIdx((i) => i + 1)
        setIsRevealing(true)
      }, AUTO_PLAY_DELAY)
    }
    return () => clearAuto()
  }, [autoPlay, isRevealing, currentIdx, scenes.length])

  function handleShare() {
    const url = `${window.location.origin}/story/${slug}`
    navigator.clipboard?.writeText(url)
    setShowShare(true)
    setTimeout(() => setShowShare(false), 2000)
  }

  function handlePageActivate() {
    goNext()
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentIdx}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SceneBackground mood={scene.mood} />
        </motion.div>
      </AnimatePresence>

      {/* Readability veil */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, color-mix(in srgb, var(--background) 18%, transparent) 0%, transparent 70%), linear-gradient(180deg, color-mix(in srgb, var(--background) 55%, transparent) 0%, transparent 28%, transparent 62%, color-mix(in srgb, var(--background) 75%, transparent) 100%)",
        }}
      />

      {/* Story masthead */}
      <header className="relative z-20 pt-16 sm:pt-[4.5rem] px-5 text-center">
        <button
          type="button"
          onClick={exitStory}
          aria-label="Close story"
          title="Close story (Esc)"
          className="absolute right-4 top-16 sm:top-[4.5rem] flex size-9 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--surface-bg)]/80 text-muted hover:text-fg transition-colors backdrop-blur-sm"
        >
          <X className="size-4" />
        </button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-marginalia text-[10px] tracking-[0.2em] text-[var(--verdigris)]/70 uppercase mb-1.5"
        >
          {scene.mood}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-base sm:text-lg text-fg/70 tracking-wide pr-10"
        >
          {title}
        </motion.h1>
      </header>

      {scene.imageUrl && (
        <motion.div
          key={`img-${currentIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage: `url(${scene.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%) contrast(1.1)",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Page well — tap to skip / advance */}
      <button
        type="button"
        onClick={handlePageActivate}
        aria-label={isRevealing ? "Skip typing" : "Next scene"}
        className="relative z-10 flex-1 w-full flex items-center justify-center px-5 sm:px-8 pb-36 pt-6 text-left cursor-pointer"
      >
        <div className="relative w-full max-w-xl">
          <div
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 sm:-inset-x-8 sm:-inset-y-8 rounded-sm opacity-90"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--card) 28%, transparent), color-mix(in srgb, var(--card) 12%, transparent))",
              boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--border) 35%, transparent)",
            }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={`scene-${currentIdx}`}
              className="relative px-2 py-2"
              initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <SceneText
                ref={textRef}
                text={scene.text}
                mood={scene.mood}
                readingMs={scene.readingMs}
                onComplete={handleRevealComplete}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </button>

      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-36 z-30 flex justify-center px-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 rounded-sm border border-[var(--border)] bg-[var(--card)]/90 px-4 py-3 backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
              <p className="font-marginalia text-[11px] text-[var(--verdigris)] tracking-wide">
                the volume ends here
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exitStory}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--blood)]/40 bg-[var(--blood)]/15 px-3 py-1.5 text-xs text-[var(--blood)] hover:bg-[var(--blood)]/25 transition-colors"
                >
                  <BookOpen className="size-3.5" />
                  Library
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--border)] px-3 py-1.5 text-xs text-muted hover:text-fg transition-colors"
                >
                  <Home className="size-3.5" />
                  Home
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SceneAudio soundCue={scene.soundCue} enabled={audioEnabled} />

      <PlaybackBar
        current={currentIdx}
        total={scenes.length}
        isRevealing={isRevealing}
        autoPlay={autoPlay}
        audioEnabled={audioEnabled}
        onPrev={goPrev}
        onNext={goNext}
        onJump={jumpTo}
        onToggleAuto={() => setAutoPlay((v) => !v)}
        onToggleAudio={() => setAudioEnabled((v) => !v)}
        onShare={handleShare}
        onExit={exitStory}
      />

      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed bottom-40 left-1/2 z-[60] -translate-x-1/2 rounded-sm border border-[var(--border)] bg-[var(--card)]/95 px-4 py-2 text-xs text-[var(--foreground)] backdrop-blur-sm"
          >
            Link copied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
