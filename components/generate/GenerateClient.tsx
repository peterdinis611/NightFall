"use client"

import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BloodSpinner } from "@/components/shared/BloodSpinner"
import Link from "next/link"
import { BookOpen, Home, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { sanitizeGenerationError } from "@/lib/sanitizeError"

const WHISPERS = [
  "Listening to the darkness between your words…",
  "Ink is spreading across the page…",
  "Something is being woken up…",
  "The story remembers you…",
  "Shadows are taking shape…",
  "Your fear is being transcribed…",
]

const RITUAL_STEPS = [
  { id: "bind", label: "Bind the prompt", after: 0 },
  { id: "open", label: "Open the dark", after: 6 },
  { id: "write", label: "Inscribe the scenes", after: 16 },
  { id: "seal", label: "Seal the volume", after: 36 },
] as const

function useRotatingIndex(length: number, intervalMs: number) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % length), intervalMs)
    return () => clearInterval(id)
  }, [length, intervalMs])
  return index
}

function formatElapsed(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

function etaHint(length: string | undefined, elapsed: number) {
  const typical =
    length === "long" ? 90 : length === "short" ? 35 : 55
  const remaining = Math.max(0, typical - elapsed)
  if (elapsed < 8) return "usually under a minute"
  if (remaining <= 0) return "any moment now"
  return `about ${remaining}s more · typical`
}

export function GenerateClient({ slug }: { slug: string }) {
  const router = useRouter()
  const story = useQuery(api.stories.getBySlug, { slug })
  const [elapsed, setElapsed] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const whisperIdx = useRotatingIndex(WHISPERS.length, 3400)

  useEffect(() => {
    if (story?.status === "ready" && !leaving) {
      const t = setTimeout(() => router.replace(`/story/${slug}`), 700)
      return () => clearTimeout(t)
    }
  }, [story?.status, slug, router, leaving])

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const hasFailed = story?.status === "failed"
  const isReady = story?.status === "ready"
  const activeStep = useMemo(() => {
    if (isReady) return RITUAL_STEPS.length
    let step = 0
    for (let i = 0; i < RITUAL_STEPS.length; i++) {
      if (elapsed >= RITUAL_STEPS[i].after) step = i
    }
    return step
  }, [elapsed, isReady])

  const progress = isReady
    ? 100
    : Math.min(92, 8 + elapsed * (story?.length === "long" ? 1.1 : 2.2))

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, color-mix(in srgb, var(--blood) 12%, transparent), transparent 70%), radial-gradient(ellipse 80% 60% at 50% 100%, color-mix(in srgb, var(--background) 90%, transparent), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)",
        }}
        aria-hidden
      />

      <Link
        href="/library"
        className="absolute top-20 right-4 sm:right-6 z-20 flex size-9 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--surface-bg)]/80 text-muted hover:text-fg transition-colors"
        aria-label="Leave to library"
        title="Leave — generation continues"
        onClick={() => setLeaving(true)}
      >
        <X className="size-4" />
      </Link>

      <AnimatePresence mode="wait">
        {hasFailed ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-md manuscript-card p-8 text-center"
          >
            <p className="font-marginalia text-[11px] text-[var(--blood)] mb-3 tracking-wide">
              fol. torn
            </p>
            <h1 className="font-serif text-2xl text-[var(--blood)] mb-3">
              The ritual failed
            </h1>
            <p className="text-muted text-sm mb-8 leading-relaxed">
              {sanitizeGenerationError(story?.errorMessage)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/library" className="btn-ghost inline-flex items-center gap-2">
                <BookOpen className="size-4" />
                Library
              </Link>
              <Link
                href="/#generate"
                className="btn-primary inline-flex items-center gap-2 !py-2.5"
              >
                Try again
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative z-10 w-full max-w-lg"
          >
            <div className="manuscript-card px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="font-marginalia text-[11px] text-[var(--verdigris)] tracking-wide mb-1">
                    fol. pending · keep this tab open
                  </p>
                  <h1 className="font-serif text-xl sm:text-2xl text-fg leading-snug">
                    {isReady
                      ? "The volume is ready"
                      : story?.title && story.title !== "Generating…"
                        ? story.title
                        : "Summoning your story"}
                  </h1>
                </div>
                <BloodSpinner size="md" className="shrink-0" />
              </div>

              {story?.prompt && (
                <blockquote className="mb-7 border-l-2 border-[var(--blood)]/40 pl-4 text-left">
                  <p className="font-serif italic text-sm sm:text-base text-fg/75 leading-relaxed line-clamp-3">
                    “{story.prompt}”
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-muted tracking-wider uppercase">
                    {[story.tone, story.length].filter(Boolean).join(" · ")}
                  </p>
                </blockquote>
              )}

              {/* Ritual steps */}
              <ol className="mb-7 space-y-2.5 text-left">
                {RITUAL_STEPS.map((step, i) => {
                  const done = i < activeStep || isReady
                  const current = i === activeStep && !isReady
                  return (
                    <li
                      key={step.id}
                      className={cn(
                        "flex items-center gap-3 text-sm transition-colors",
                        done && "text-fg/70",
                        current && "text-fg",
                        !done && !current && "text-muted/45",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-sm border font-mono text-[10px]",
                          done && "border-[var(--blood)]/50 bg-[var(--blood)]/15 text-[var(--blood)]",
                          current && "border-[var(--verdigris)]/50 text-[var(--verdigris)]",
                          !done && !current && "border-[var(--border)]",
                        )}
                      >
                        {done ? "✓" : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("font-serif", current && "italic")}>
                        {step.label}
                        {current && (
                          <span className="ml-2 font-marginalia text-[10px] text-[var(--verdigris)] not-italic">
                            now
                          </span>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ol>

              {/* Progress */}
              <div className="mb-6">
                <div className="mb-1.5 flex justify-between font-mono text-[10px] text-muted tabular-nums">
                  <span>{formatElapsed(elapsed)} in the dark</span>
                  <span>{etaHint(story?.length, elapsed)}</span>
                </div>
                <div className="h-px w-full overflow-hidden rounded-full bg-[var(--border)]/60">
                  <motion.div
                    className="h-full bg-[var(--blood)]/60"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="min-h-[3rem] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={isReady ? "ready" : whisperIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className="text-center font-serif italic text-sm sm:text-base text-muted"
                  >
                    {isReady
                      ? "Opening the first page…"
                      : WHISPERS[whisperIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/library"
                  onClick={() => setLeaving(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
                >
                  <BookOpen className="size-3.5" />
                  Leave to library
                  <span className="text-muted/50">· keeps generating</span>
                </Link>
                <span className="hidden sm:inline text-muted/30">·</span>
                <Link
                  href="/"
                  onClick={() => setLeaving(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
                >
                  <Home className="size-3.5" />
                  Home
                </Link>
              </div>
            </div>

            <p className="mt-4 text-center font-marginalia text-[10px] text-muted/60 tracking-wide">
              generation runs on the server — closing this page is safe after ~10s
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
