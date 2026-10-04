"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { useConvexAuth } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { api } from "@convex/_generated/api"
import { cn } from "~/lib/utils"
import { ToneSelector, type Tone } from "./ToneSelector"
import { LengthSelector, type Length } from "./LengthSelector"
import { ThemeGrid } from "./ThemeGrid"
import { Skull, AlertCircle, Ghost, LogIn } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { formatAuthError } from "~/lib/formatAuthError"
import {
  clearPendingPrompt,
  readPendingPrompt,
  savePendingPrompt,
  type PendingPrompt,
} from "~/lib/pendingPrompt"
import { TEST_CASES } from "~/lib/testCases"
import { BloodSpinner } from "~/components/shared/BloodSpinner"

const PLACEHOLDER_PROMPTS = [
  "Something lives in the walls of my apartment. It knows my name.",
  "An abandoned hospital where the lights keep turning on.",
  "The message carved into the tree was in my handwriting.",
  "We found a door at the bottom of the lake.",
  "My reflection stopped following me three days ago.",
]

const showTestCases = import.meta.env.DEV

export function PromptForm() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const { signIn } = useAuthActions()
  const createShell = useMutation(api.stories.createStoryShell)
  const autoSubmitRef = useRef(false)
  const guestPendingRef = useRef(false)

  const [prompt, setPrompt]   = useState("")
  const [theme, setTheme]     = useState("")
  const [tone, setTone]       = useState<Tone>("atmospheric")
  const [length, setLength]   = useState<Length>("medium")
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState<"guest" | "summoning" | null>(null)
  const [error, setError]     = useState<string | null>(null)

  const [placeholder] = useState(
    () => PLACEHOLDER_PROMPTS[Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length)]
  )

  async function startGeneration(values: PendingPrompt) {
    setLoading(true)
    setPhase("summoning")
    setError(null)

    try {
      const { storyId, slug } = await createShell({
        prompt: values.prompt.trim(),
        theme:  values.theme || values.prompt.trim(),
        tone: values.tone,
        length: values.length,
      })
      clearPendingPrompt()
      guestPendingRef.current = false
      navigate({ to: "/generate", search: { storyId, slug } })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      if (msg.toLowerCase().includes("authentication")) {
        savePendingPrompt(values)
        navigate({ to: "/auth", search: { redirect: "/" } })
        return
      }
      setError(msg)
      setLoading(false)
      setPhase(null)
      guestPendingRef.current = false
    }
  }

  // After guest sign-in or return from /auth — restore draft and submit once
  useEffect(() => {
    if (authLoading || !isAuthenticated || autoSubmitRef.current) return
    const pending = readPendingPrompt()
    if (!pending?.prompt?.trim()) {
      if (guestPendingRef.current) {
        guestPendingRef.current = false
      }
      return
    }

    autoSubmitRef.current = true
    setPrompt(pending.prompt)
    setTheme(pending.theme)
    setTone(pending.tone)
    setLength(pending.length)
    void startGeneration(pending)
  }, [authLoading, isAuthenticated])

  async function continueAsGuest(values: PendingPrompt) {
    setLoading(true)
    setPhase("guest")
    setError(null)
    savePendingPrompt(values)
    guestPendingRef.current = true
    try {
      await Promise.race([
        signIn("anonymous"),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => {
            reject(new Error("Guest sign-in timed out. Try again, or sign in with email."))
          }, 15000)
        }),
      ])
      // Effect above will auto-submit once isAuthenticated flips
    } catch (err) {
      guestPendingRef.current = false
      setError(formatAuthError(err, "signIn"))
      setLoading(false)
      setPhase(null)
    }
  }

  // If guest signed in but auto-submit never started, surface it
  useEffect(() => {
    if (!loading || phase !== "guest") return
    const id = window.setTimeout(() => {
      if (!isAuthenticated) {
        guestPendingRef.current = false
        setError("Still waiting for a guest session. Check your connection, then try again.")
        setLoading(false)
        setPhase(null)
      }
    }, 18000)
    return () => window.clearTimeout(id)
  }, [loading, phase, isAuthenticated])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    const values: PendingPrompt = {
      prompt: prompt.trim(),
      theme,
      tone,
      length,
    }

    if (!authLoading && !isAuthenticated) {
      await continueAsGuest(values)
      return
    }

    await startGeneration(values)
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
            loading && "opacity-60 pointer-events-none"
          )}
        />
        <span className="absolute bottom-3 right-4 text-[10px] text-night-600 font-mono tabular-nums">
          {prompt.length}/400
        </span>
      </div>

      {showTestCases && (
        <div className="rounded-sm border border-[var(--border)] bg-[var(--surface-bg)] px-3 py-3">
          <p className="font-marginalia text-[11px] text-[var(--verdigris)] mb-2">
            test pages · dev only
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TEST_CASES.map((tc) => (
              <button
                key={tc.id}
                type="button"
                title={tc.note}
                disabled={loading}
                onClick={() => {
                  setPrompt(tc.prompt)
                  setTheme(tc.theme)
                  setTone(tc.tone)
                  setLength(tc.length)
                  setError(null)
                }}
                className="chip !text-[11px] !py-1 disabled:opacity-40"
              >
                {tc.label}
              </button>
            ))}
          </div>
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

      <motion.button
        type="submit"
        disabled={!prompt.trim() || loading}
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
            onClick={() =>
              void continueAsGuest({ prompt: prompt.trim(), theme, tone, length })
            }
            disabled={!prompt.trim() || loading}
            className="inline-flex items-center gap-1.5 hover:text-fg transition-colors disabled:opacity-40"
          >
            <Ghost className="size-3.5" />
            Continue as guest
          </button>
          <span className="hidden sm:inline opacity-40">·</span>
          <button
            type="button"
            onClick={() => {
              if (prompt.trim()) {
                savePendingPrompt({ prompt: prompt.trim(), theme, tone, length })
              }
              navigate({ to: "/auth", search: { redirect: "/" } })
            }}
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
