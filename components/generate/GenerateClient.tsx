"use client"

import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { X } from "lucide-react"
import { sanitizeGenerationError } from "@/lib/sanitizeError"

const WAITING = [
  "The page is still blank.",
  "Something is choosing the words.",
  "Do not refresh.",
  "It knows you are waiting.",
]

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

export function GenerateClient({ slug }: { slug: string }) {
  const router = useRouter()
  const story = useQuery(api.stories.getBySlug, { slug })
  const [elapsed, setElapsed] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const lineIdx = useRotatingIndex(WAITING.length, 4200)

  useEffect(() => {
    if (story?.status === "ready" && !leaving) {
      const t = setTimeout(() => router.replace(`/story/${slug}`), 600)
      return () => clearTimeout(t)
    }
  }, [story?.status, slug, router, leaving])

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const hasFailed = story?.status === "failed"
  const isReady = story?.status === "ready"

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-24 pb-16">
      <Link
        href="/library"
        className="absolute top-20 right-4 sm:right-6 z-20 flex size-9 items-center justify-center border border-[var(--border)] text-muted hover:text-fg transition-colors"
        aria-label="Leave to library"
        title="Leave — generation continues"
        onClick={() => setLeaving(true)}
      >
        <X className="size-4" />
      </Link>

      {hasFailed ? (
        <div className="w-full max-w-md border-t border-[var(--blood)]/60 pt-8 text-center">
          <h1 className="font-serif text-2xl text-[var(--blood)] mb-3">
            It stopped writing
          </h1>
          <p className="text-muted text-sm mb-8 leading-relaxed">
            {sanitizeGenerationError(story?.errorMessage)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <Link href="/library" className="text-muted hover:text-fg underline-offset-4 hover:underline">
              Library
            </Link>
            <Link href="/#generate" className="btn-clot">
              Try again
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-6">
            {formatElapsed(elapsed)}
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl text-fg leading-tight mb-6">
            {isReady
              ? "Ready."
              : story?.title && story.title !== "Generating…"
                ? story.title
                : "Writing."}
          </h1>

          {story?.prompt && (
            <blockquote className="mb-10 border-l border-[var(--blood)]/50 pl-4">
              <p className="font-serif italic text-base text-fg/70 leading-relaxed line-clamp-4">
                {story.prompt}
              </p>
            </blockquote>
          )}

          <div className="h-px w-full bg-[var(--border)] mb-8 overflow-hidden">
            <div
              className="h-full bg-[var(--blood)]/70 transition-[width] duration-1000 ease-out"
              style={{
                width: isReady
                  ? "100%"
                  : `${Math.min(90, 6 + elapsed * (story?.length === "long" ? 1 : 2))}%`,
              }}
            />
          </div>

          <p className="font-serif text-lg text-muted min-h-[2rem]" aria-live="polite">
            {isReady ? "Opening…" : WAITING[lineIdx]}
          </p>

          <p className="mt-14 text-xs text-muted">
            <Link
              href="/library"
              onClick={() => setLeaving(true)}
              className="hover:text-fg underline-offset-4 hover:underline"
            >
              Leave
            </Link>
            <span className="mx-2 opacity-40">—</span>
            generation continues on the server
          </p>
        </div>
      )}
    </main>
  )
}
