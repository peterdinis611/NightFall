"use client"

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Mood = "dread" | "chase" | "reveal" | "silence" | "descent" | "pulse" | "static" | "fog"

export type SceneTextHandle = {
  skip: () => void
  isDone: () => boolean
}

interface Props {
  text: string
  mood: Mood
  readingMs: number
  onComplete: () => void
}

const MOOD_SPEED: Record<Mood, number> = {
  fog: 45,
  silence: 55,
  dread: 40,
  descent: 35,
  static: 30,
  pulse: 20,
  chase: 15,
  reveal: 50,
}

export const SceneText = forwardRef<SceneTextHandle, Props>(function SceneText(
  { text, mood, onComplete },
  ref,
) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const rafRef = useRef<number>()
  const lastTickRef = useRef(0)
  const doneRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const chars = Array.from(text)

  onCompleteRef.current = onComplete

  const speed = MOOD_SPEED[mood] ?? 40

  function maybeCorrupt(char: string): string {
    if (mood !== "static") return char
    if (Math.random() < 0.05) {
      const glitch = "█▓▒░╗╔╝╚╬╫╪┼"
      return glitch[Math.floor(Math.random() * glitch.length)]
    }
    return char
  }

  function finish() {
    if (doneRef.current) return
    doneRef.current = true
    setDisplayed(chars.join(""))
    setDone(true)
    onCompleteRef.current()
  }

  useImperativeHandle(ref, () => ({
    skip: () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      finish()
    },
    isDone: () => doneRef.current,
  }))

  useEffect(() => {
    setDisplayed("")
    setDone(false)
    doneRef.current = false
    indexRef.current = 0
    lastTickRef.current = 0

    function tick(time: number) {
      if (time - lastTickRef.current >= speed) {
        lastTickRef.current = time
        indexRef.current++
        setDisplayed(chars.slice(0, indexRef.current).map(maybeCorrupt).join(""))
        if (indexRef.current >= chars.length) {
          finish()
          return
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const isChase = mood === "chase"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: isChase ? 0.2 : 0.8 }}
      className={cn(
        "relative z-10 w-full max-w-[38rem] mx-auto",
        "font-serif text-[1.15rem] sm:text-[1.35rem] md:text-[1.5rem]",
        "leading-[1.75] tracking-[0.01em]",
        "text-left sm:text-justify",
        moodTextClass(mood),
      )}
    >
      {isChase ? (
        <ChaseLineReveal text={text} onComplete={finish} />
      ) : (
        <p className="drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
          {displayed}
          {!done && <span className="typewriter-cursor" aria-hidden />}
        </p>
      )}
    </motion.div>
  )
})

function ChaseLineReveal({ text, onComplete }: { text: string; onComplete: () => void }) {
  const lines = text.split(/\n|(?<=\. )/g).filter(Boolean)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    setShown(0)
    let i = 0
    const id = setInterval(() => {
      i++
      setShown(i)
      if (i >= lines.length) {
        clearInterval(id)
        setTimeout(onComplete, 600)
      }
    }, 300)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div className="space-y-2">
      {lines.slice(0, shown).map((line, i) => (
        <motion.p
          key={`${i}-${line.slice(0, 8)}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}

function moodTextClass(mood: Mood): string {
  switch (mood) {
    case "fog":
      return "text-fg/85"
    case "silence":
      return "text-fg/75 tracking-[0.08em]"
    case "dread":
      return "text-fg/90"
    case "descent":
      return "text-fg/85"
    case "static":
      return "text-fg/80 font-mono text-[0.95em]"
    case "pulse":
      return "text-[var(--blood)] uppercase tracking-[0.14em] text-[0.95em]"
    case "chase":
      return "text-fg/95 text-left"
    case "reveal":
      return "text-fg/85 italic"
    default:
      return "text-fg/90"
  }
}
