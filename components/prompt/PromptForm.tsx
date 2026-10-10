"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useConvexAuth } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { api } from "@convex/_generated/api"
import { cn } from "@/lib/utils"
import { ToneSelector, type Tone } from "./ToneSelector"
import { LengthSelector, type Length } from "./LengthSelector"
import { ThemeGrid } from "./ThemeGrid"
import { Skull, AlertCircle, Ghost, LogIn, Play } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { formatAuthError } from "@/lib/formatAuthError"
import { formatRateLimitError } from "@/lib/formatRateLimitError"
import {
  TEST_CASES,
  RECOMMENDED_DEMO_ID,
  getTestCase,
} from "@/lib/testCases"
import type { PendingPrompt } from "@/lib/pendingPrompt"
import { BloodSpinner } from "@/components/shared/BloodSpinner"
import { createStoryAction } from "@/app/actions/stories"

const PLACEHOLDER_PROMPTS = [
  "Something lives in the walls of my apartment. It knows my name.",
  "An abandoned hospital where the lights keep turning on.",
  "The message carved into the tree was in my handwriting.",
  "We found a door at the bottom of the lake.",
  "My reflection stopped following me three days ago.",
]

const showTestCases = process.env.NODE_ENV === "development"

export function PromptForm() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const { signIn } = useAuthActions()
  const createShell = useMutation(api.stories.createStoryShell)
  const rateLimit = useQuery(api.rateLimit.status, isAuthenticated ? {} : "skip")
  const demoBooted = useRef(false)

  const [prompt, setPrompt] = useState("")
  const [theme, setTheme] = useState("")
  const [tone, setTone] = useState<Tone>("atmospheric")
  const [length, setLength] = useState<Length>("medium")
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState<"guest" | "summoning" | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Stable SSR default; pick a random prompt only after mount
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_PROMPTS[0])
  useEffect(() => {
    setPlaceholder(
      PLACEHOLDER_PROMPTS[Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length)],
    )
  }, [])

  function applyCase(tc: PendingPrompt & { id?: string }) {
    setPrompt(tc.prompt)
    setTheme(tc.theme)
    setTone(tc.tone)
    setLength(tc.length)
    setError(null)
  }

  function isNextRedirect(err: unknown) {
    return String((err as { digest?: string })?.digest ?? "").startsWith("NEXT_REDIRECT")
  }

  async function summonStory(asGuest: boolean, override?: PendingPrompt) {
    const payload = {
      prompt: (override?.prompt ?? prompt).trim(),
      theme: (override?.theme ?? theme) || (override?.prompt ?? prompt).trim(),
      tone: override?.tone ?? tone,
      length: override?.length ?? length,
    }
    if (!payload.prompt || loading) return

    setLoading(true)
    setError(null)

    try {
      // Prefer Convex client mutation — Server Actions often "Failed to fetch"
      // when cookies/middleware race or a stale tab hits a dead port.
      const needGuest = asGuest || (!authLoading && !isAuthenticated)
      if (needGuest) {
        setPhase("guest")
        await signIn("anonymous")
      }

      setPhase("summoning")
      try {
        const { storyId, slug } = await createShell(payload)
        router.push(`/generate?storyId=${storyId}&slug=${slug}`)
        return
      } catch (clientErr) {
        // Fallback: Server Action (cookie token) if client mutation fails
        if (!needGuest) {
          await createStoryAction(payload)
          return
        }
        throw clientErr
      }
    } catch (err) {
      if (isNextRedirect(err)) return
      const rateLimited = formatRateLimitError(err)
      if (rateLimited) {
        setError(rateLimited)
      } else if (err instanceof Error && err.message.toLowerCase().includes("authentication")) {
        setError(formatAuthError(err, "signIn"))
      } else {
        const msg = err instanceof Error ? err.message : "Something went wrong"
        setError(
          msg === "Failed to fetch"
            ? "Connection failed — refresh and use http://localhost:3000 (not 3001)."
            : msg,
        )
      }
      setLoading(false)
      setPhase(null)
    }
  }

  async function runDemo(id: string) {
    const tc = getTestCase(id)
    if (!tc || authLoading) return
    applyCase(tc)
    await summonStory(!isAuthenticated, tc)
  }

  // Deep link: /?demo=smoke-short  or  /?demo=smoke-short&run=1
  useEffect(() => {
    if (!showTestCases || demoBooted.current || authLoading) return
    const params = new URLSearchParams(window.location.search)
    const demoId = params.get("demo")
    if (!demoId) return
    const tc = getTestCase(demoId)
    if (!tc) return
    demoBooted.current = true
    applyCase(tc)
    if (params.get("run") === "1") {
      void summonStory(!isAuthenticated, tc)
    }
    router.replace("/#generate", { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot once from URL
  }, [authLoading, isAuthenticated])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (authLoading) {
      setError("Auth is still loading — wait a moment and try again.")
      return
    }
    await summonStory(!isAuthenticated)
  }

  const needsAuth = !authLoading && !isAuthenticated

  const loadingLabel =
    phase === "guest"
      ? "Entering as guest…"
      : phase === "summoning"
        ? "Opening the story shell…"
        : "Working…"

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={false}
      className="relative flex flex-col gap-5 w-full"
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-sm bg-[var(--card)]/90 backdrop-blur-[2px]"
          >
            <BloodSpinner size="md" label={loadingLabel} />
            <p className="font-marginalia text-[10px] text-[var(--verdigris)] tracking-wide">
              keep this page open
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          rows={4}
          maxLength={400}
          className={cn(
            "input-field resize-none px-5 py-4 font-serif text-lg leading-relaxed",
            "placeholder:text-night-500/80",
            loading && "opacity-60 pointer-events-none",
          )}
        />
        <span className="absolute bottom-3 right-4 text-[10px] text-night-600 font-mono tabular-nums">
          {prompt.length}/400
        </span>
      </div>

      {showTestCases && (
        <div className="rounded-sm border border-[var(--verdigris)]/35 bg-[var(--surface-bg)] px-3 py-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-marginalia text-[11px] text-[var(--verdigris)]">
              demo · fill klikom · ▶ spustí generovanie
            </p>
            <button
              type="button"
              disabled={loading || authLoading}
              title="Guest + short atmospheric — najrýchlejší smoke test"
              onClick={() => void runDemo(RECOMMENDED_DEMO_ID)}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--blood)]/50 bg-[var(--blood)]/15 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide text-[var(--blood)] hover:bg-[var(--blood)]/25 disabled:opacity-40"
            >
              <Play className="size-3" />
              Run smoke demo
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEST_CASES.map((tc) => (
              <button
                key={tc.id}
                type="button"
                title={`${tc.note} · Shift+klik = fill + summon`}
                disabled={loading}
                onClick={(e) => {
                  if (e.shiftKey) {
                    void runDemo(tc.id)
                    return
                  }
                  applyCase(tc)
                }}
                onDoubleClick={() => void runDemo(tc.id)}
                className={cn(
                  "chip !text-[11px] !py-1 disabled:opacity-40",
                  tc.recommended && "chip-active",
                )}
              >
                {tc.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted/80 leading-relaxed">
            Tip: <span className="text-fg/70">Run smoke demo</span> alebo double-click / Shift+klik na chip.
            URL: <code className="text-[var(--verdigris)]">/?demo=smoke-short&amp;run=1</code>
          </p>
        </div>
      )}

      <div className="divider-gradient" />

      <ThemeGrid selected={theme} onSelect={setTheme} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label-section">Tone</label>
          <ToneSelector value={tone} onChange={setTone} />
        </div>
        <div>
          <label className="label-section">Length</label>
          <LengthSelector value={length} onChange={setLength} />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 rounded-xl border border-blood-700/35 bg-blood-900/20 px-4 py-3 text-sm text-blood-300"
        >
          <AlertCircle className="size-4 shrink-0 text-blood-400" />
          {error}
        </motion.div>
      )}

      {rateLimit && (
        <p className="font-marginalia text-[10px] text-[var(--verdigris)] tracking-wide text-center sm:text-left">
          {rateLimit.generating
            ? "a story is already in the dark — wait for it"
            : rateLimit.cooldownRemainingMs > 0
              ? `cooldown ${Math.ceil(rateLimit.cooldownRemainingMs / 1000)}s · ${rateLimit.remaining.hourly}/${rateLimit.limits.hourlyMax} left this hour`
              : `${rateLimit.remaining.hourly}/${rateLimit.limits.hourlyMax} summons left this hour · ${rateLimit.remaining.daily} today${
                  rateLimit.isAnonymous ? " · guest" : ""
                }`}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={!prompt.trim() || loading || Boolean(rateLimit && !rateLimit.canCreate)}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full !py-4 !text-base mt-1"
      >
        {loading ? (
          <>
            <BloodSpinner size="sm" />
            {loadingLabel}
          </>
        ) : (
          <>
            <Skull className="size-5" />
            {needsAuth ? "Generate as guest" : "Generate Story"}
          </>
        )}
      </motion.button>

      {needsAuth && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-muted">
          <button
            type="button"
            onClick={() => void summonStory(true)}
            disabled={!prompt.trim() || loading}
            className="inline-flex items-center gap-1.5 hover:text-fg transition-colors disabled:opacity-40"
          >
            <Ghost className="size-3.5" />
            Continue as guest
          </button>
          <span className="hidden sm:inline opacity-40">·</span>
          <button
            type="button"
            onClick={() => router.push("/auth?redirect=/")}
            className="inline-flex items-center gap-1.5 hover:text-fg transition-colors"
          >
            <LogIn className="size-3.5" />
            Sign in instead
          </button>
        </div>
      )}
    </motion.form>
  )
}
