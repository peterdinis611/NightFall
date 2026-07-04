import { motion } from "framer-motion"
import { Link } from "@tanstack/react-router"
import { Ghost, ArrowLeft } from "lucide-react"

export function NotFoundScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]/95 backdrop-blur-sm px-4">
      <motion.div
        className="relative max-w-md w-full text-center surface p-8 shadow-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="relative mb-6 select-none h-24 flex items-center justify-center">
          <span className="font-serif text-7xl font-bold text-night-800/80">404</span>
          <motion.span
            className="absolute font-serif text-7xl font-bold text-gradient opacity-30"
            animate={{ x: [0, 3, -2, 0], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            404
          </motion.span>
        </div>

        <Ghost className="mx-auto size-9 text-violet-400/40 mb-4" />

        <h1 className="font-serif text-2xl font-semibold text-fg mb-2">
          Lost in the void
        </h1>
        <p className="text-muted text-sm mb-8 leading-relaxed">
          This page doesn't exist — or perhaps it was never meant to be found.
        </p>

        <Link to="/" className="btn-ghost inline-flex items-center gap-2">
          <ArrowLeft className="size-4" />
          Return to safety
        </Link>
      </motion.div>
    </div>
  )
}
