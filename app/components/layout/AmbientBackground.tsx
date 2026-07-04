import { motion } from "framer-motion"

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top violet glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }}
      />
      {/* Bottom crimson glow */}
      <div
        className="absolute -bottom-32 right-0 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(185,28,28,0.12) 0%, transparent 70%)" }}
      />
      {/* Floating orbs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width:  `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            left:   `${(i * 19 + 8) % 90}%`,
            top:    `${(i * 23 + 15) % 85}%`,
            background: i % 2 === 0
              ? "rgba(139, 92, 246, 0.06)"
              : "rgba(185, 28, 28, 0.05)",
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale:   [1, 1.2, 1],
            x:       [0, (i % 2 ? 24 : -24), 0],
            y:       [0, (i % 3 ? -18 : 18), 0],
          }}
          transition={{
            duration:   10 + i * 2,
            repeat:     Infinity,
            ease:       "easeInOut",
            delay:      i * 1.5,
          }}
        />
      ))}
    </div>
  )
}
