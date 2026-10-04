import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { RitualCircle } from "./HauntedScape"
import { AppBrand } from "~/components/shared/AppBrand"
import { useTheme } from "~/lib/theme"

const TAGLINES = [
  "Something is already listening.",
  "Name the fear. The page answers.",
  "Every prompt opens a door.",
  "The dark finishes your sentences.",
  "You can leave. The story may not.",
]

type LandingHeroProps = {
  onScrollToForm: () => void
}

export function LandingHero({ onScrollToForm }: LandingHeroProps) {
  const { theme } = useTheme()
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const tagTimer = setInterval(
      () => setTaglineIndex((i) => (i + 1) % TAGLINES.length),
      4400,
    )
    const glitchTimer = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 160)
    }, 8000 + Math.random() * 5000)

    return () => {
      clearInterval(tagTimer)
      clearInterval(glitchTimer)
    }
  }, [])

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 pt-28 pb-24 overflow-hidden">
      {theme === "dark" ? <RitualCircle /> : <AshHalo />}

      {/* Ink bloom */}
      <div
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[min(90vw,680px)] h-[420px] pointer-events-none ambient-glow-pulse motion-reduce:animate-none"
        style={{
          background:
            theme === "light"
              ? "radial-gradient(ellipse, rgba(122,31,46,0.07) 0%, rgba(61,107,90,0.04) 40%, transparent 72%)"
              : "radial-gradient(ellipse, rgba(122,31,46,0.18) 0%, rgba(20,40,34,0.12) 45%, transparent 72%)",
        }}
      />

      {theme === "dark" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, transparent 8%, rgba(6,5,4,0.94) 78%, #050403 100%)",
          }}
        />
      )}

      {/* Folio plate */}
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <motion.div
          className="folio-plate px-6 py-14 sm:px-12 sm:py-16 text-center"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="font-marginalia text-[11px] sm:text-xs text-[var(--verdigris)] mb-8 tracking-wide"
          >
            a private volume · not for daylight
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 1 }}
          >
            <h1 className="font-serif text-[clamp(3.75rem,14vw,8.5rem)] leading-[0.88] tracking-[-0.02em] mb-10">
              <AppBrand split className="horror-title text-fg block" />
            </h1>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.85 }}
            className="mx-auto mb-8 h-px w-24 origin-center"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--blood), var(--verdigris), transparent)",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9 }}
            className="font-serif text-2xl sm:text-3xl lg:text-[2.15rem] text-fg/90 leading-[1.2] mb-6"
          >
            What are you{" "}
            <span className="relative inline-block px-1">
              <span className={`horror-word italic ${glitch ? "animate-glitch" : ""}`}>
                afraid
              </span>
              {glitch && (
                <>
                  <span
                    aria-hidden
                    className="absolute inset-0 horror-word italic animate-glitch-1 opacity-70"
                  >
                    afraid
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 horror-word italic animate-glitch-2 opacity-50"
                  >
                    afraid
                  </span>
                </>
              )}
            </span>{" "}
            of?
          </motion.p>

          <div className="h-8 mb-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55 }}
                className="font-sans text-base sm:text-lg text-muted italic"
              >
                {TAGLINES[taglineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button onClick={onScrollToForm} className="btn-summon group">
              <span className="btn-summon-glow" />
              <span className="btn-summon-inner">Open the volume</span>
            </button>
            <a href="#features" className="btn-ghost !rounded-sm !px-6 !py-3.5 !text-sm">
              Read the ritual
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.4 }}
            className="mt-10 font-marginalia text-[10px] text-muted tracking-wider"
          >
            fol. i · begin here
          </motion.p>
        </motion.div>
      </div>

      <motion.button
        onClick={onScrollToForm}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted hover:text-[var(--blood)] transition-colors z-10"
        aria-label="Scroll to form"
      >
        <span className="font-marginalia text-[10px] tracking-[0.2em]">turn the page</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-4 opacity-70" />
        </motion.div>
      </motion.button>
    </section>
  )
}

function AshHalo() {
  return (
    <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div
        className="size-80 sm:size-[28rem] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(122,31,46,0.05) 45%, transparent 70%)",
          border: "1px solid rgba(30,28,26,0.08)",
        }}
      />
    </div>
  )
}
