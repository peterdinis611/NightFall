"use client"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useMutation, useAction } from "convex/react"
import { useConvexAuth } from "convex/react"
import { api } from "@convex/_generated/api"
import { cn } from "~/lib/utils"
import { ToneSelector, type Tone } from "./ToneSelector"
import { LengthSelector, type Length } from "./LengthSelector"
import { ThemeGrid } from "./ThemeGrid"
import { Skull, Sparkles, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

const PLACEHOLDER_PROMPTS = [
  "Something lives in the walls of my apartment. It knows my name.",
  "An abandoned hospital where the lights keep turning on.",
  "The message carved into the tree was in my handwriting.",
  "We found a door at the bottom of the lake.",
  "My reflection stopped following me three days ago.",
]

export function PromptForm() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const createShell  = useMutation(api.stories.createStoryShell)
  const generateStory = useAction(api.actions.generateStory)

  const [prompt, setPrompt]   = useState("")
  const [theme, setTheme]     = useState("")
  const [tone, setTone]       = useState<Tone>("atmospheric")
  const [length, setLength]   = useState<Length>("medium")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const [placeholder] = useState(
    () => PLACEHOLDER_PROMPTS[Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length)]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return

    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/auth", search: { redirect: "/" } })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { storyId, slug } = await createShell({
        prompt: prompt.trim(),
        theme:  theme || prompt.trim(),
        tone,
        length,
      })

      navigate({ to: "/generate", search: { storyId, slug } })

      generateStory({ storyId, prompt: prompt.trim(), theme: theme || prompt.trim(), tone, length })
        .catch(console.error)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      if (msg.toLowerCase().includes("authentication")) {
        navigate({ to: "/auth", search: { redirect: "/" } })
        return
      }
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={false}
      className="flex flex-col gap-5 w-full"
    >
      {/* Main textarea */}
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
            <Sparkles className="size-5 animate-shimmer" />
            Summoning your story…
          </>
        ) : (
          <>
            <Skull className="size-5" />
            Generate Story
          </>
        )}
      </motion.button>
    </motion.form>
  )
}
