"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SceneBackground } from "./SceneBackground"
import { SceneText } from "./SceneText"
import { SceneAudio } from "./SceneAudio"
import { PlaybackBar } from "./PlaybackBar"
import { useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"

interface Scene {
  _id:        string
  order:      number
  text:       string
  mood:       "dread"|"chase"|"reveal"|"silence"|"descent"|"pulse"|"static"|"fog"
  soundCue:   string
  imageUrl?:  string | null
  readingMs:  number
}

interface Props {
  storyId:   Id<"stories">
  title:     string
  scenes:    Scene[]
  slug:      string
}

const AUTO_PLAY_DELAY = 800 // ms after reveal before advancing

export function StoryPlayer({ storyId, title, scenes, slug }: Props) {
  const [currentIdx,   setCurrentIdx]   = useState(0)
  const [isRevealing,  setIsRevealing]  = useState(true)
  const [autoPlay,     setAutoPlay]     = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [sessionId,    setSessionId]    = useState<Id<"playback_sessions"> | null>(null)
  const [showShare,    setShowShare]    = useState(false)
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const recordPlay  = useMutation(api.stories.recordPlay)
  const updatePlay  = useMutation(api.stories.updatePlaySession)

  const scene = scenes[currentIdx]

  // Record play start on mount
  useEffect(() => {
    recordPlay({ storyId }).then((id) => setSessionId(id ?? null)).catch(() => {})
  }, [storyId])

  // Update session progress
  useEffect(() => {
    if (!sessionId) return
    const completed = currentIdx === scenes.length - 1 && !isRevealing
    updatePlay({ sessionId, sceneReached: currentIdx, completed }).catch(() => {})
  }, [currentIdx, isRevealing, sessionId])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext() }
      if (e.key === "ArrowLeft")  { e.preventDefault(); goPrev() }
      if (e.key === "a" || e.key === "A") setAutoPlay((v) => !v)
      if (e.key === "m" || e.key === "M") setAudioEnabled((v) => !v)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isRevealing, currentIdx])

  // Auto-play: advance after reveal complete + delay
  const handleRevealComplete = useCallback(() => {
    setIsRevealing(false)
    if (autoPlay && currentIdx < scenes.length - 1) {
      autoTimerRef.current = setTimeout(() => {
        setCurrentIdx((i) => i + 1)
        setIsRevealing(true)
      }, AUTO_PLAY_DELAY)
    }
  }, [autoPlay, currentIdx, scenes.length])

  // When autoPlay turns on and reveal is already done, start timer
  useEffect(() => {
    if (autoPlay && !isRevealing && currentIdx < scenes.length - 1) {
      autoTimerRef.current = setTimeout(() => {
        setCurrentIdx((i) => i + 1)
        setIsRevealing(true)
      }, AUTO_PLAY_DELAY)
    }
    return () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current) }
  }, [autoPlay])

  function goNext() {
    if (isRevealing || currentIdx >= scenes.length - 1) return
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    setCurrentIdx((i) => i + 1)
    setIsRevealing(true)
  }

  function goPrev() {
    if (currentIdx === 0) return
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    setCurrentIdx((i) => i - 1)
    setIsRevealing(true)
  }

  function handleShare() {
    const url = `${window.location.origin}/story/${slug}`
    navigator.clipboard?.writeText(url)
    setShowShare(true)
    setTimeout(() => setShowShare(false), 2000)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background – changes per scene */}
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

      {/* Scene title (scene 1 only) */}
      {currentIdx === 0 && (
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute top-16 left-0 right-0 text-center font-serif text-sm uppercase tracking-[0.3em] text-night-600 px-4"
        >
          {title}
        </motion.h1>
      )}

      {/* Scene image (if available) */}
      {scene.imageUrl && (
        <motion.div
          key={`img-${currentIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:   `url(${scene.imageUrl})`,
            backgroundSize:    "cover",
            backgroundPosition: "center",
            filter:            "grayscale(100%) contrast(1.1)",
            mixBlendMode:      "overlay",
          }}
        />
      )}

      {/* Scene text – AnimatePresence with wait mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`scene-${currentIdx}`}
          className="relative z-10 w-full flex items-center justify-center min-h-[60vh] px-4"
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, scale: 0.97, filter: "blur(4px)" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <SceneText
            text={scene.text}
            mood={scene.mood}
            readingMs={scene.readingMs}
            onComplete={handleRevealComplete}
          />
        </motion.div>
      </AnimatePresence>

      {/* Scene counter */}
      <div className="absolute top-8 right-8 text-xs font-mono text-night-700">
        {currentIdx + 1} / {scenes.length}
      </div>

      {/* Audio */}
      <SceneAudio soundCue={scene.soundCue} enabled={audioEnabled} />

      {/* Playback bar */}
      <PlaybackBar
        current={currentIdx}
        total={scenes.length}
        isRevealing={isRevealing}
        autoPlay={autoPlay}
        audioEnabled={audioEnabled}
        onPrev={goPrev}
        onNext={goNext}
        onToggleAuto={() => setAutoPlay((v) => !v)}
        onToggleAudio={() => setAudioEnabled((v) => !v)}
        onShare={handleShare}
      />

      {/* Share toast */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 rounded-full border border-night-700 bg-night-900/90 px-4 py-2 text-xs text-night-300 backdrop-blur-sm"
          >
            Link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
