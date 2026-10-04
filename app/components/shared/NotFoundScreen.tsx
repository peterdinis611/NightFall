import { motion } from "framer-motion"
import { Link } from "@tanstack/react-router"
import { Ghost, ArrowLeft } from "lucide-react"

const WHISPERS = ["...where am I?", "turn back", "it's empty here", "don't look down"]

export function NotFoundScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]/95 backdrop-blur-sm px-4 overflow-hidden">
      {/* Drifting void glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: 240 + i * 100,
              height: 240 + i * 100,
              left: `${10 + i * 30}%`,
              top: `${20 + i * 18}%`,
              background:
                i === 1
                  ? "rgba(139, 92, 246, 0.1)"
                  : "rgba(30, 28, 56, 0.35)",
            }}
            animate={{
              opacity: [0.25, 0.55, 0.25],
              scale: [1, 1.18, 1],
              x: [0, i % 2 ? 30 : -30, 0],
              y: [0, i % 2 ? -20 : 20, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.2,
            }}
          />
        ))}

        {/* Vignette pulse */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(76,29,149,0.15) 100%)",
          }}
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating whispers */}
        {WHISPERS.map((text, i) => (
          <motion.span
            key={text}
            className="absolute font-serif italic text-xs text-violet-400/25 select-none"
            style={{
              left: `${8 + i * 22}%`,
              top: `${18 + (i * 17) % 50}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0.6, 0],
              y: [0, -24, -24, -48],
              filter: ["blur(0px)", "blur(0px)", "blur(1px)", "blur(3px)"],
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

      <motion.div
        className="relative max-w-md w-full text-center surface p-8 shadow-card overflow-hidden"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {/* Scanline flicker */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,92,246,0.5) 2px, rgba(139,92,246,0.5) 4px)",
          }}
          animate={{ opacity: [0.01, 0.04, 0.01] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
        />

        {/* Glitching 404 */}
        <div className="relative mb-6 select-none h-24 flex items-center justify-center">
          <motion.span
            className="font-serif text-7xl font-bold text-night-800/80"
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.span>

          <motion.span
            className="absolute font-serif text-7xl font-bold text-gradient"
            animate={{
              x: [0, 4, -3, 2, 0],
              y: [0, -2, 1, 0],
              opacity: [0.15, 0.5, 0.2, 0.45, 0.15],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.span>

          <motion.span
            className="absolute font-serif text-7xl font-bold text-violet-500/30"
            animate={{
              x: [0, -5, 3, 0],
              opacity: [0, 0.35, 0, 0.25, 0],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          >
            404
          </motion.span>
        </div>

        {/* Floating ghost */}
        <motion.div
          className="relative mx-auto mb-4 flex size-14 items-center justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Ghost className="relative size-9 text-violet-400/60" />
          </motion.div>
        </motion.div>

        <motion.h1
          className="font-serif text-2xl font-semibold text-fg mb-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Lost in the void
        </motion.h1>

        <motion.p
          className="text-muted text-sm mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
          }}
        >
          This page doesn't exist — or perhaps it was never meant to be found.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/" className="btn-ghost inline-flex items-center gap-2">
            <motion.span
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowLeft className="size-4" />
            </motion.span>
            Return to safety
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
