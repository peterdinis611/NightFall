"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Skull } from "lucide-react"
import { AppBrand } from "~/components/shared/AppBrand"

const KEY = "nightfall_cw_accepted"

export function ContentWarning() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = typeof window !== "undefined" && localStorage.getItem(KEY)
    if (!accepted) setShow(true)
  }, [])

  function accept() {
    localStorage.setItem(KEY, "1")
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)]/95 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-sm surface p-8 shadow-card text-center"
          >
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-blood-700/30 bg-blood-900/25 shadow-glow-sm">
              <Skull className="size-8 text-blood-400" />
            </div>

            <p className="label-section !mb-3 !text-blood-500/60">Before you enter</p>
            <h2 className="font-serif text-2xl font-semibold text-fg mb-3">
              Content Warning
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-7">
              <AppBrand /> generates <strong className="text-fg">dark, horror-themed</strong> fiction
              using AI. Content may include psychological horror, violence, disturbing imagery,
              and themes of death. Not suitable for people under 16.
            </p>

            <button onClick={accept} className="btn-primary w-full">
              I understand, continue
            </button>

            <p className="mt-3 text-[11px] text-night-600">
              By continuing you confirm you are 16 or older.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
