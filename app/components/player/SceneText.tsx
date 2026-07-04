"use client"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "~/lib/utils"

type Mood = "dread"|"chase"|"reveal"|"silence"|"descent"|"pulse"|"static"|"fog"

interface Props {
  text: string
  mood: Mood
  readingMs: number
  onComplete: () => void
}

const MOOD_SPEED: Record<Mood, number> = {
  fog:      45,
  silence:  55,
  dread:    40,
  descent:  35,
  static:   30,
  pulse:    20,
  chase:    15,
  reveal:   50,
}

export function SceneText({ text, mood, readingMs, onComplete }: Props) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone]           = useState(false)
  const indexRef                   = useRef(0)
  const rafRef                     = useRef<number>()
  const lastTickRef                = useRef(0)
  const chars                      = Array.from(text)  // Unicode-aware split

  const speed = MOOD_SPEED[mood] ?? 40

  // For "static" mood: occasionally render wrong char then correct it
  function maybeCorrrupt(char: string): string {
    if (mood !== "static") return char
    if (Math.random() < 0.05) {
      const glitch = "█▓▒░╗╔╝╚╬╫╪┼"
      return glitch[Math.floor(Math.random() * glitch.length)]
    }
    return char
  }

  useEffect(() => {
    setDisplayed("")
    setDone(false)
    indexRef.current  = 0
    lastTickRef.current = 0

    function tick(time: number) {
      if (time - lastTickRef.current >= speed) {
        lastTickRef.current = time
        indexRef.current++
        setDisplayed(
          chars.slice(0, indexRef.current).map(maybeCorrrupt).join("")
        )
        if (indexRef.current >= chars.length) {
          setDone(true)
          onComplete()
          return
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const isChase   = mood === "chase"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: isChase ? 0.2 : 0.8 }}
      className={cn(
        "relative z-10 max-w-2xl mx-auto px-6 text-center",
        "font-serif text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide",
        moodTextClass(mood)
      )}
    >
      {isChase ? (
        <ChaseLineReveal text={text} onComplete={onComplete} />
      ) : (
        <p>
          {displayed}
          {!done && <span className="typewriter-cursor" />}
        </p>
      )}
    </motion.div>
  )
}

/** Chase mood: reveal line by line in sharp bursts */
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
    <div className="space-y-1">
      {lines.slice(0, shown).map((line, i) => (
        <motion.p
          key={`${i}-${line.slice(0,8)}`}
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
    case "fog":      return "text-mist-300/90"
    case "silence":  return "text-night-300/80 tracking-[0.12em]"
    case "dread":    return "text-night-200/90"
    case "descent":  return "text-night-200/85"
    case "static":   return "text-night-300/80 font-mono"
    case "pulse":    return "text-blood-300/90 uppercase tracking-widest"
    case "chase":    return "text-night-100/95 text-left"
    case "reveal":   return "text-night-300/90 italic"
    default:         return "text-night-200"
  }
}
