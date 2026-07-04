import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Skull, Flame } from "lucide-react"
import { RitualCircle } from "./HauntedScape"
import { useTheme } from "~/lib/theme"

const TAGLINES = [
  "Tell the AI what scares you.",
  "Every prompt becomes a nightmare.",
  "Where your deepest fears find words.",
  "Something is listening.",
  "The dark remembers everything.",
]

type LandingHeroProps = {
  onScrollToForm: () => void
}

export function LandingHero({ onScrollToForm }: LandingHeroProps) {
  const { theme } = useTheme()
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [glitch, setGlitch] = useState(false)
  const [flicker, setFlicker] = useState(false)

  useEffect(() => {
    const tagTimer = setInterval(
      () => setTaglineIndex((i) => (i + 1) % TAGLINES.length),
      4000
    )
    const glitchTimer = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 200)
    }, 5000 + Math.random() * 4000)

    const flickerTimer = setInterval(() => {
      setFlicker(true)
      setTimeout(() => setFlicker(false), 80)
    }, 9000 + Math.random() * 6000)

    return () => {
      clearInterval(tagTimer)
      clearInterval(glitchTimer)
      clearInterval(flickerTimer)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-20 overflow-hidden">
      {/* Ritual circle — dark / soft halo — light */}
      {theme === "dark" ? <RitualCircle /> : <LightHalo />}

      {/* Central glow — animated */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] pointer-events-none"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: theme === "light"
            ? "radial-gradient(ellipse, rgba(255,240,200,0.18) 0%, rgba(159,18,57,0.05) 35%, rgba(91,75,138,0.04) 60%, transparent 72%)"
            : "radial-gradient(ellipse, rgba(196,30,58,0.07) 0%, rgba(109,92,173,0.05) 40%, transparent 70%)",
        }}
      />

      {/* Vignette — dark mode only */}
      {theme === "dark" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 20%, rgba(5,5,8,0.85) 100%)",
          }}
        />
      )}

      <div className={`relative z-10 text-center max-w-4xl mx-auto transition-opacity duration-75 ${flicker ? "opacity-70" : "opacity-100"}`}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 rounded-full border px-5 py-2 mb-10 shadow-glow-sm backdrop-blur-sm"
          style={{
            borderColor: theme === "light" ? "rgba(159,18,57,0.2)" : "rgba(196,30,58,0.3)",
            backgroundColor: theme === "light" ? "rgba(255,255,255,0.6)" : "rgba(14,13,24,0.7)",
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="size-3.5" style={{ color: theme === "light" ? "#9f1239" : "#e8a0a8" }} />
          </motion.span>
          <span
            className="text-[11px] font-mono uppercase tracking-[0.25em]"
            style={{ color: theme === "light" ? "#9f1239" : "#e8a0a8" }}
          >
            AI Horror Story Generator
          </span>
          <motion.span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: theme === "light" ? "#9f1239" : "#c41e3a" }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          <h1 className="horror-title font-serif text-5xl sm:text-7xl lg:text-[5.5rem] font-semibold text-fg leading-[1.02] tracking-tight mb-2">
            What are you
          </h1>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-[5.5rem] font-semibold leading-[1.02] tracking-tight mb-2">
            <span className="relative inline-block">
              <span
                className={`horror-word italic ${glitch ? "animate-glitch" : ""}`}
              >
                afraid
              </span>
              {glitch && (
                <>
                  <span aria-hidden className="absolute inset-0 horror-word italic animate-glitch-1 opacity-80 text-blood-400">
                    afraid
                  </span>
                  <span aria-hidden className="absolute inset-0 horror-word italic animate-glitch-2 opacity-60 text-violet-400">
                    afraid
                  </span>
                </>
              )}
              {/* Blood drip under word */}
              <motion.span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-gradient-to-r from-transparent via-ember-500 to-transparent dark:via-blood-600"
                animate={{ opacity: [0.3, 0.8, 0.3], scaleX: [0.8, 1.1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
          </h1>
          <h1 className="horror-title font-serif text-5xl sm:text-7xl lg:text-[5.5rem] font-semibold text-fg leading-[1.02] tracking-tight mb-8">
            of?
          </h1>
        </motion.div>

        {/* Divider with skull */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[var(--primary)] opacity-30" />
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Skull className="size-4 opacity-50" style={{ color: "var(--primary)" }} />
          </motion.div>
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[var(--primary)] opacity-30" />
        </motion.div>

        {/* Cycling tagline */}
        <div className="h-9 mb-12 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIndex}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.6 }}
              className="font-serif text-lg sm:text-xl text-muted italic horror-flicker"
            >
              {TAGLINES[taglineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button onClick={onScrollToForm} className="btn-summon group">
            <span className="btn-summon-glow" />
            <span className="btn-summon-inner">
              <Skull className="size-5 group-hover:animate-pulse" />
              Summon your story
            </span>
          </button>
          <a href="#features" className="btn-ghost !px-7 !py-3.5 !text-sm border-white/10 hover:border-blood-600/30">
            How it works
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-3 sm:gap-6 max-w-md mx-auto"
        >
          {[
            { value: "8", label: "Scene moods", icon: "🌑" },
            { value: "4", label: "Horror tones", icon: "💀" },
            { value: "∞", label: "Nightmares", icon: "🩸" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="stat-tomb"
            >
              <motion.span
                className="text-sm mb-1 block opacity-50"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              >
                {stat.icon}
              </motion.span>
              <p className="font-serif text-2xl sm:text-3xl font-semibold text-fg horror-title">
                {stat.value}
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-muted mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={onScrollToForm}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted hover:text-blood-500 dark:hover:text-blood-400 transition-colors z-10"
        aria-label="Scroll to form"
      >
        <motion.span
          className="text-[10px] uppercase tracking-[0.3em] font-mono"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Descend
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <ChevronDown className="size-5" />
          <ChevronDown className="size-5 -mt-3 opacity-40" />
        </motion.div>
      </motion.button>

      <CornerRune position="top-left" />
      <CornerRune position="top-right" />
      <CornerRune position="bottom-left" />
      <CornerRune position="bottom-right" />
    </section>
  )
}

function LightHalo() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <motion.div
        className="size-72 sm:size-96 rounded-full border border-[rgba(159,18,57,0.08)]"
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: "inset 0 0 60px rgba(159,18,57,0.04), 0 0 80px rgba(255,220,150,0.08)" }}
      />
      <motion.div
        className="absolute inset-8 rounded-full border border-[rgba(91,75,138,0.1)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

function CornerRune({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const posClass = {
    "top-left":     "top-24 left-5 sm:left-10",
    "top-right":    "top-24 right-5 sm:right-10",
    "bottom-left":  "bottom-24 left-5 sm:left-10",
    "bottom-right": "bottom-24 right-5 sm:right-10",
  }[position]

  const runes = ["ᛟ", "ᛞ", "ᛗ", "ᛚ"]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ delay: 1.2, duration: 1.5 }}
      className={`absolute ${posClass} pointer-events-none hidden sm:block`}
    >
      <div className="relative size-16 border border-blood-700/20">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-serif text-blood-600/40 text-lg">
          {runes[["top-left", "top-right", "bottom-left", "bottom-right"].indexOf(position)]}
        </span>
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-blood-600/30" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-blood-600/30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-blood-600/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-blood-600/30" />
      </div>
    </motion.div>
  )
}
