import { motion } from "framer-motion"
import { Link } from "@tanstack/react-router"
import { AlertTriangle, Ghost, RefreshCw, Home } from "lucide-react"
import { AppBrand } from "~/components/shared/AppBrand"

type ErrorScreenProps = {
  title?: string
  message?: string
  onRetry?: () => void
  showHome?: boolean
}

export function ErrorScreen({
  title = "Something went wrong",
  message = "The darkness swallowed this page. Try again or return home.",
  onRetry,
  showHome = true,
}: ErrorScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]/95 backdrop-blur-sm px-4">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(ellipse at center, rgba(185,28,28,0.1) 0%, transparent 65%)",
        }}
      />

      <motion.div
        className="relative max-w-md w-full text-center surface p-8 shadow-card"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <motion.div
          className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-blood-700/30 bg-blood-900/20"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(220,38,38,0)",
              "0 0 0 10px rgba(220,38,38,0.06)",
              "0 0 0 0 rgba(220,38,38,0)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <AlertTriangle className="size-8 text-blood-400" />
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <Ghost className="size-3.5 text-violet-400/50" />
          <AppBrand className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted" />
        </div>

        <h1 className="font-serif text-2xl font-semibold text-fg mb-3">{title}</h1>
        <p className="text-muted text-sm leading-relaxed mb-8">{message}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRetry && (
            <button onClick={onRetry} className="btn-ghost flex items-center gap-2">
              <RefreshCw className="size-4" />
              Try again
            </button>
          )}
          {showHome && (
            <Link to="/" className="btn-primary flex items-center gap-2 !py-2.5">
              <Home className="size-4" />
              Back home
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}
