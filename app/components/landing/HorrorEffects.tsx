import { motion } from "framer-motion"
import { useParallaxOffset } from "~/hooks/useParallax"
import {
  HauntedScape,
  EmberRain,
  LightningFlash,
  SpiderWebs,
} from "./HauntedScape"

export function FogLayer() {
  const y = useParallaxOffset(0.12)

  return (
    <motion.div style={{ y }} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse ${50 + i * 15}% ${35 + i * 8}% at ${20 + i * 18}% ${40 + i * 12}%, rgba(180,175,200,0.12) 0%, transparent 65%)`,
          }}
          animate={{
            x: [0, i % 2 ? 80 : -80, 0],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: 14 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
      {/* Low hanging fog band */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[40vh]"
        style={{
          background: "linear-gradient(to top, rgba(30,28,56,0.5) 0%, transparent 100%)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </motion.div>
  )
}

const WHISPERS = [
  "...can you hear it?",
  "don't turn around",
  "it's watching you",
  "the door was locked",
  "your name...",
  "behind you",
  "don't sleep",
  "it remembers",
]

export function FloatingWhispers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {WHISPERS.map((text, i) => (
        <motion.span
          key={i}
          className="absolute font-serif italic text-xs sm:text-sm text-blood-600/30 select-none"
          style={{
            left: `${5 + i * 12}%`,
            top:  `${15 + (i * 13) % 55}%`,
          }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            y: [0, -20, -20, -40],
            filter: ["blur(0px)", "blur(0px)", "blur(1px)", "blur(2px)"],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            delay: i * 2.2,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.span>
      ))}
    </div>
  )
}

export function FloatingEyes() {
  const eyes = [
    { x: "5%",  y: "18%", delay: 0,   size: 1 },
    { x: "92%", y: "28%", delay: 2,   size: 1.2 },
    { x: "82%", y: "72%", delay: 4,   size: 0.9 },
    { x: "10%", y: "65%", delay: 5.5, size: 1.1 },
    { x: "48%", y: "12%", delay: 7,   size: 0.8 },
    { x: "70%", y: "55%", delay: 9,   size: 1 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {eyes.map((eye, i) => (
        <motion.div
          key={i}
          className="absolute flex gap-1.5"
          style={{
            left: eye.x,
            top: eye.y,
            scale: eye.size,
          }}
          animate={{ opacity: [0, 0, 0.35, 0.35, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: eye.delay,
            times: [0, 0.05, 0.15, 0.75, 1],
          }}
        >
          <Eye />
          <Eye delay={0.15} />
        </motion.div>
      ))}
    </div>
  )
}

function Eye({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative size-5">
      <div
        className="absolute inset-0 rounded-full border border-night-500/50"
        style={{ background: "radial-gradient(circle at 50% 50%, #1e1c38 0%, #0a0814 100%)" }}
      />
      <motion.div
        className="absolute size-2 rounded-full bg-[#c41e3a] top-1 left-1"
        style={{ boxShadow: "0 0 6px rgba(196,30,58,0.5)" }}
        animate={{
          scaleY: [1, 0.05, 1],
          x: [0, 2, -1, 0],
        }}
        transition={{
          scaleY: { duration: 0.12, repeat: Infinity, repeatDelay: 3 + delay, delay: 1.5 + delay },
          x: { duration: 4, repeat: Infinity, delay: delay },
        }}
      />
    </div>
  )
}

export function BloodDrip() {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none h-20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blood-500/80 to-transparent" />

      {[8, 18, 32, 48, 55, 68, 82, 94].map((left, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-[2px]"
          style={{
            left: `${left}%`,
            background: "linear-gradient(to bottom, #dc2626, #991b1b 60%, transparent)",
          }}
          animate={{
            height: ["0px", `${28 + (i % 4) * 16}px`, `${28 + (i % 4) * 16}px`, "0px"],
            opacity: [0, 1, 0.7, 0],
          }}
          transition={{
            duration: 3.5 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.9,
            ease: "easeInOut",
          }}
        />
      ))}

      {[25, 58, 85].map((left, i) => (
        <motion.div
          key={`drop-${i}`}
          className="absolute top-0 size-1.5 rounded-full bg-blood-500"
          style={{
            left: `${left}%`,
            boxShadow: "0 0 6px #dc2626",
          }}
          animate={{
            y: [0, 60, 90],
            opacity: [0, 1, 0],
            scale: [0.4, 1, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 2 + i * 4,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  )
}

export function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.025]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
      }}
    />
  )
}

/** Red vignette pulse — opacity only (no box-shadow animation) */
export function HeartbeatVignette() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(196,30,58,0.12) 100%)",
      }}
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export function HorrorEffects() {
  return (
    <>
      <HauntedScape />
      <FogLayer />
      <EmberRain />
      <HeartbeatVignette />
      <FloatingWhispers />
      <FloatingEyes />
      <SpiderWebs />
      <BloodDrip />
      <LightningFlash />
      <ScanlineOverlay />
    </>
  )
}
