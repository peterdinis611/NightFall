import { motion } from "framer-motion"
import { Ghost } from "lucide-react"

type LoadingScreenProps = {
  message?: string
  submessage?: string
  fullScreen?: boolean
}

export function LoadingScreen({
  message = "Entering the darkness…",
  submessage,
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]/95 backdrop-blur-sm"
          : "flex flex-col items-center justify-center py-24"
      }
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: 220 + i * 90,
              height: 220 + i * 90,
              left: `${15 + i * 28}%`,
              top: `${25 + i * 12}%`,
              background: i === 1
                ? "rgba(139, 92, 246, 0.08)"
                : "rgba(185, 28, 28, 0.07)",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
            transition={{ duration: 3.5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          />
        ))}
      </div>

      <motion.div
        className="relative flex flex-col items-center gap-7"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative flex size-14 items-center justify-center rounded-2xl border border-blood-700/30 bg-blood-900/25">
            <motion.div
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Ghost className="size-7 text-blood-400" />
            </motion.div>
          </div>
        </div>

        <div className="flex items-end gap-1.5 h-9">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{
                background: i % 2 === 0
                  ? "linear-gradient(to top, #b91c1c, #f87171)"
                  : "linear-gradient(to top, #7c3aed, #a78bfa)",
              }}
              animate={{ height: ["10px", "32px", "10px"] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <div className="text-center">
          <motion.p
            className="font-serif text-lg text-fg italic"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {message}
          </motion.p>
          {submessage && (
            <p className="mt-2 text-xs text-muted font-mono">{submessage}</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
