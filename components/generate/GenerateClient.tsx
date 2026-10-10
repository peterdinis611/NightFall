"use client"

import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BloodSpinner } from "@/components/shared/BloodSpinner"
import Link from "next/link"

const SCARY_LINES = [
  "Listening to the darkness between your words…",
  "Ink is spreading across the page…",
  "Something is being woken up…",
  "The story remembers you…",
  "Shadows are taking shape…",
  "Your fear is being transcribed…",
]

function useRotatingIndex(length: number, intervalMs: number) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % length), intervalMs)
    return () => clearInterval(id)
  }, [length, intervalMs])
  return index
}

function CyclingText({ lines }: { lines: string[] }) {
  const index = useRotatingIndex(lines.length, 3200)
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5 }}
        className="text-muted font-serif italic text-base"
      >
        {lines[index]}
      </motion.p>
    </AnimatePresence>
  )
}

export function GenerateClient({ slug }: { slug: string }) {
  const router = useRouter()
  const story = useQuery(api.stories.getBySlug, { slug })
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (story?.status === "ready") {
      router.replace(`/story/${slug}`)
    }
  }, [story?.status, slug, router])

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const hasFailed = story?.status === "failed"
  const statusLabel =
    story == null
      ? "Opening the volume…"
      : story.status === "generating"
        ? "Generating your story…"
        : "Almost there…"

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      <AnimatePresence mode="wait">
        {hasFailed ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center max-w-md manuscript-card p-8"
          >
            <p className="text-[var(--blood)] font-serif text-xl mb-4">
              Something went wrong in the dark.
            </p>
            <p className="text-muted text-sm mb-6">{story?.errorMessage}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/library" className="btn-ghost inline-flex items-center gap-2">
                Open library
              </Link>
              <Link href="/#generate" className="btn-primary inline-flex items-center gap-2 !py-2.5">
                Try again
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg manuscript-card p-10"
          >
            <BloodSpinner size="lg" className="mx-auto mb-8" label={statusLabel} />

            <p className="font-marginalia text-[11px] text-[var(--verdigris)] mb-6 tracking-wide">
              fol. pending · do not close this page
            </p>

            <CyclingText lines={SCARY_LINES} />

            <p className="mt-8 font-mono text-[10px] tabular-nums text-muted/70 tracking-wider">
              {elapsed < 60
                ? `${elapsed}s in the dark`
                : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s in the dark`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
