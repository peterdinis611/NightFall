import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const QUOTES = [
  "It knew my name before I typed it.",
  "I couldn't stop reading until 3 AM.",
  "The scene with the mirror — I had to pause.",
  "Generated from one sentence. One sentence.",
  "My library is a graveyard of bad decisions.",
  "The fog animation actually made me uneasy.",
  "I wrote 'something in the attic' and regretted everything.",
  "Better than most horror anthologies I've read.",
]

export function LandingMarquee() {
  const doubled = [...QUOTES, ...QUOTES]

  return (
    <div className="relative py-10 overflow-hidden border-y border-[var(--border)] bg-[var(--surface-bg)]">
      <div className="absolute inset-0 bg-gradient-to-r from-blood-900/5 via-transparent to-blood-900/5 dark:from-blood-950/20 pointer-events-none" />
      <div
        className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
      />

      <p className="text-center text-[9px] uppercase tracking-[0.3em] text-blood-700/50 mb-4 font-mono">
        Whispers from the void
      </p>

      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((quote, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 text-sm font-serif italic text-muted"
          >
            <span className="text-blood-600/50 shrink-0">☠</span>
            "{quote}"
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function LandingCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      className="text-center mb-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="label-section !text-blood-500/60">Ready?</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-fg mt-2 mb-3">
          Write your <span className="text-gradient italic">nightmare</span>
        </h2>
        <p className="text-muted text-sm max-w-md mx-auto">
          One prompt. A full horror story with scenes, moods, and narration.
        </p>
      </motion.div>
    </motion.div>
  )
}
