import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { BloodSpinner } from "~/components/shared/BloodSpinner"

const searchSchema = z.object({
  storyId: z.string(),
  slug: z.string(),
})

export const Route = createFileRoute("/generate")({
  validateSearch: searchSchema,
  component: GeneratePage,
})

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

function GeneratePage() {
  const { slug } = Route.useSearch()
  const navigate = useNavigate()
  const story = useQuery(api.stories.getBySlug, { slug })
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (story?.status === "ready") {
      navigate({ to: "/story/$slug", params: { slug } })
    }
  }, [story?.status, slug, navigate])

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const hasFailed = story?.status === "failed"
  const statusLabel =
    story === undefined
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
              <button
                onClick={() => navigate({ to: "/library" })}
                className="btn-ghost inline-flex items-center gap-2"
              >
                Open library
              </button>
              <button
                onClick={() => navigate({ to: "/" })}
                className="btn-primary inline-flex items-center gap-2 !py-2.5"
              >
                Try again
              </button>
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
