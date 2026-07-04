"use client"
import { motion, useAnimationFrame } from "framer-motion"
import { useRef, useState } from "react"
import { cn } from "~/lib/utils"

type Mood = "dread"|"chase"|"reveal"|"silence"|"descent"|"pulse"|"static"|"fog"

interface Props { mood: Mood }

export function SceneBackground({ mood }: Props) {
  switch (mood) {
    case "fog":      return <FogBackground />
    case "silence":  return <SilenceBackground />
    case "dread":    return <DreadBackground />
    case "descent":  return <DescentBackground />
    case "static":   return <StaticBackground />
    case "pulse":    return <PulseBackground />
    case "chase":    return <ChaseBackground />
    case "reveal":   return <RevealBackground />
    default:         return <DreadBackground />
  }
}

// ── Fog ──────────────────────────────────────────────────────────────────────
function FogBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#111827]">
      {[
        { x: "15%", y: "20%", w: 400, h: 300, delay: 0,   dur: 12 },
        { x: "55%", y: "50%", w: 500, h: 350, delay: 3,   dur: 15 },
        { x: "30%", y: "70%", w: 350, h: 250, delay: 6,   dur: 10 },
      ].map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-slate-500/10 blur-[80px]"
          style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1220]/80 via-transparent to-[#0c1220]/60" />
    </div>
  )
}

// ── Silence ───────────────────────────────────────────────────────────────────
function SilenceBackground() {
  return (
    <div className="absolute inset-0 bg-[#050508]">
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #0a0a14 0%, #050508 70%)" }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

// ── Dread ─────────────────────────────────────────────────────────────────────
function DreadBackground() {
  return (
    <div className="absolute inset-0 bg-[#0d0918]">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 40% 60%, #1a0a2e 0%, #0d0918 70%)",
            "radial-gradient(ellipse at 60% 40%, #13052a 0%, #0d0918 70%)",
            "radial-gradient(ellipse at 40% 60%, #1a0a2e 0%, #0d0918 70%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

// ── Descent ───────────────────────────────────────────────────────────────────
function DescentBackground() {
  return (
    <div className="absolute inset-0 bg-[#0a0510] overflow-hidden">
      <motion.div
        className="absolute inset-[-10%]"
        style={{ background: "radial-gradient(ellipse at 50% 30%, #1a0520 0%, #0a0510 60%)" }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050208]/70" />
    </div>
  )
}

// ── Static ────────────────────────────────────────────────────────────────────
function StaticBackground() {
  const [opacity, setOpacity] = useState(0.05)
  const frameRef = useRef(0)

  useAnimationFrame(() => {
    frameRef.current++
    if (frameRef.current % 3 === 0) {
      setOpacity(0.03 + Math.random() * 0.09)
    }
  })

  return (
    <div className="absolute inset-0 bg-[#0a0a10]">
      <div
        className="absolute inset-0 bg-noise"
        style={{ opacity, backgroundSize: `${64 + Math.floor(Math.random() * 64)}px` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/60 via-transparent to-[#050508]/80" />
    </div>
  )
}

// ── Pulse ─────────────────────────────────────────────────────────────────────
function PulseBackground() {
  return (
    <div className="absolute inset-0 bg-[#0f0205]">
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(180,10,20,0.15) 0%, transparent 65%)" }}
        animate={{
          scale:  [1, 1.04, 1, 1.02, 1],
          opacity: [0.6, 1, 0.6, 0.9, 0.6],
        }}
        transition={{ duration: 1, repeat: Infinity, ease: [0.2, 0, 0.8, 1] }}
      />
    </div>
  )
}

// ── Chase ─────────────────────────────────────────────────────────────────────
function ChaseBackground() {
  return (
    <div className="absolute inset-0 bg-[#080210]">
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #140520 0%, #080210 60%)" }}
        animate={{ x: [0, -3, 2, -1, 1, 0], y: [0, 1, -2, 1, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 bg-blood-900/10"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2.5 }}
      />
    </div>
  )
}

// ── Reveal ────────────────────────────────────────────────────────────────────
function RevealBackground() {
  return (
    <div className="absolute inset-0 bg-[#0c0c14]">
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #1a1a28 0%, #0c0c14 60%)" }}
        animate={{ filter: ["brightness(0.1)", "brightness(0.35)", "brightness(0.2)"] }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />
    </div>
  )
}
