import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"

const searchSchema = z.object({
  storyId: z.string(),
  slug:    z.string(),
})

export const Route = createFileRoute("/generate")({
  validateSearch: searchSchema,
  component: GeneratePage,
})

const SCARY_LINES = [
  "Listening to the darkness between your words…",
  "The AI descends into the abyss…",
  "Something is being woken up…",
  "The story remembers you…",
  "Shadows are taking shape…",
  "The narrative breathes…",
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
  const index = useRotatingIndex(lines.length, 3000)
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5 }}
        className="text-night-500 font-serif italic text-base"
      >
        {lines[index]}
      </motion.p>
    </AnimatePresence>
  )
}

function GeneratePage() {
  const { storyId, slug } = Route.useSearch()
  const navigate = useNavigate()

  const story = useQuery(api.stories.getBySlug, { slug })

  useEffect(() => {
    if (story?.status === "ready") {
      navigate({ to: "/story/$slug", params: { slug } })
    }
  }, [story?.status, slug, navigate])

  const hasFailed = story?.status === "failed"

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      <AnimatePresence mode="wait">
        {hasFailed ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center max-w-md surface p-8 shadow-card"
          >
            <p className="text-blood-300 font-serif text-xl mb-4">
              Something went wrong in the dark.
            </p>
            <p className="text-night-500 text-sm mb-6">{story?.errorMessage}</p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="btn-ghost inline-flex items-center gap-2"
            >
              Try again
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg surface p-10 shadow-card"
          >
            <div className="relative mx-auto mb-10 size-24 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-blood-600/25"
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border border-violet-500/15"
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <span className="text-4xl select-none">💀</span>
            </div>

            <h2 className="font-serif text-2xl text-night-100 mb-2 font-semibold">
              Generating your story
            </h2>
            <p className="text-[11px] uppercase tracking-widest text-violet-400/50 mb-6">Please wait</p>

            <CyclingText lines={SCARY_LINES} />

            <div className="mt-8 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-1.5 rounded-full"
                  style={{ background: i === 1 ? "#8b5cf6" : "#dc2626" }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
