import { motion } from "framer-motion"
import { useParallaxOffset } from "~/hooks/useParallax"

/** Drifting mist layers — visible on light backgrounds */
function LightFog() {
  const y = useParallaxOffset(0.1)

  return (
    <motion.div style={{ y }} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse ${70 + i * 15}% ${50 + i * 10}% at ${25 + i * 22}% ${55 + i * 8}%, rgba(255,255,255,0.55) 0%, transparent 65%)`,
          }}
          animate={{
            x: [0, i % 2 ? 100 : -100, 0],
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{
            duration: 16 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2.5,
          }}
        />
      ))}
    </motion.div>
  )
}

/** Sunlight dust motes */
function DustMotes() {
  const motes = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${(i * 9.7 + 3) % 97}%`,
    delay: (i * 0.55) % 10,
    duration: 9 + (i % 6) * 2,
    size: i % 4 === 0 ? 2.5 : 1.5,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {motes.map((m) => (
        <motion.div
          key={m.id}
          className="absolute rounded-full bg-slate-400/30"
          style={{
            left: m.left,
            top: "-2%",
            width: m.size,
            height: m.size,
            boxShadow: "0 0 3px rgba(255,255,255,0.8)",
          }}
          animate={{
            y: ["0vh", "108vh"],
            x: [0, (m.id % 2 ? 40 : -40), 0],
            opacity: [0, 0.7, 0.5, 0],
          }}
          transition={{
            duration: m.duration,
            repeat: Infinity,
            delay: m.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

/** Rotating sun rays from top */
function SunRays() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0 w-[800px] h-[500px] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 0%, transparent 0deg, rgba(255,220,150,0.07) 30deg, transparent 60deg, rgba(255,220,150,0.05) 120deg, transparent 150deg, rgba(255,220,150,0.06) 200deg, transparent 240deg, rgba(255,220,150,0.04) 300deg, transparent 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 size-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,240,200,0.35) 0%, rgba(255,220,150,0.1) 40%, transparent 70%)",
          boxShadow: "0 0 60px rgba(255,220,150,0.2)",
        }}
        animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

const LIGHT_WHISPERS = [
  "too bright to see it",
  "shadows at noon",
  "the light lies",
  "something moved",
  "don't look up",
]

function LightWhispers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {LIGHT_WHISPERS.map((text, i) => (
        <motion.span
          key={i}
          className="absolute font-serif italic text-xs text-slate-500/40 select-none"
          style={{
            left: `${8 + i * 17}%`,
            top: `${18 + (i * 14) % 50}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            y: [0, -16, -16, -32],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 2.5,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.span>
      ))}
    </div>
  )
}

/** Occasional shadow sweep across screen */
function ShadowSweep() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-[1]"
      animate={{ opacity: [0, 0, 0.06, 0, 0] }}
      transition={{ duration: 14, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 1] }}
      style={{
        background: "linear-gradient(105deg, transparent 30%, rgba(20,18,31,0.15) 50%, transparent 70%)",
        backgroundSize: "200% 100%",
      }}
    />
  )
}

/** Soft horizon silhouette — distant hills */
function DistantHills() {
  const y = useParallaxOffset(0.18)

  return (
    <motion.div
      style={{ y }}
      className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 h-48 overflow-hidden opacity-30"
    >
      <svg viewBox="0 0 1440 200" className="absolute bottom-0 w-full" preserveAspectRatio="none" aria-hidden>
        <path
          fill="#94a3b8"
          opacity="0.25"
          d="M0,200 L0,120 Q200,80 400,110 T800,90 T1200,100 T1440,85 L1440,200 Z"
        />
        <path
          fill="#64748b"
          opacity="0.2"
          d="M0,200 L0,140 Q300,100 600,130 T1200,115 L1440,125 L1440,200 Z"
        />
      </svg>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}

/** Soft pulsing light vignette */
function LightPulse() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(159,18,57,0.06) 100%)",
      }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export function LightHorrorEffects() {
  return (
    <>
      <SunRays />
      <LightFog />
      <DustMotes />
      <LightWhispers />
      <DistantHills />
      <ShadowSweep />
      <LightPulse />
    </>
  )
}
