import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery, useMutation } from "convex/react"
import { useConvexAuth } from "convex/react"
import { api } from "@convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import { formatDate } from "~/lib/utils"
import { AppNav } from "~/components/layout/AppNav"
import { LoadingScreen } from "~/components/shared/LoadingScreen"
import { Trash2, Globe, Lock, BookOpen, Plus, ArrowRight } from "lucide-react"
import { useState } from "react"
import type { Id } from "@convex/_generated/dataModel"

export const Route = createFileRoute("/library")({
  component: LibraryPage,
})

function LibraryPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const result      = useQuery(api.stories.getUserStories, isAuthenticated ? {} : "skip")
  const deleteStory = useMutation(api.stories.deleteStory)
  const togglePublic = useMutation(api.stories.togglePublic)
  const [deleting, setDeleting] = useState<string | null>(null)

  const stories: Array<{
    _id: Id<"stories">
    title: string
    slug: string
    prompt: string
    tone: string
    status: string
    sceneCount: number
    playCount: number
    isPublic: boolean
    createdAt: number
    errorMessage?: string
  }> = (result as any)?.stories ?? []

  async function handleDelete(storyId: Id<"stories">) {
    if (!confirm("Delete this story? This cannot be undone.")) return
    setDeleting(storyId)
    try {
      await deleteStory({ storyId })
    } finally {
      setDeleting(null)
    }
  }

  if (authLoading) {
    return <LoadingScreen message="Opening your library…" />
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <AppNav />
        <motion.div initial={false} className="text-center">
          <BookOpen className="mx-auto size-10 text-night-700 mb-4" />
          <p className="text-night-500 font-serif italic mb-4">Sign in to view your library.</p>
          <Link
            to="/auth"
            search={{ redirect: "/library" }}
            className="inline-flex items-center gap-1.5 text-sm text-blood-500 hover:text-blood-400"
          >
            Sign in
            <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>
      </main>
    )
  }

  if (result === undefined) {
    return <LoadingScreen message="Loading your stories…" />
  }

  return (
    <main className="min-h-screen px-4 py-16 pt-28 max-w-3xl mx-auto">
      <AppNav />

      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="label-section !mb-2 !text-violet-400/60">Your stories</p>
          <motion.h1
            initial={false}
            className="font-serif text-3xl font-semibold text-night-100"
          >
            Library
          </motion.h1>
          <p className="text-night-500 text-sm mt-1">
            {stories.length} {stories.length === 1 ? "story" : "stories"} generated
          </p>
        </div>
        <Link
          to="/"
          className="btn-primary !py-2 !px-3.5 !text-xs flex items-center gap-1.5"
        >
          <Plus className="size-3.5" />
          New story
        </Link>
      </div>

      {stories.length === 0 ? (
        <motion.div
          initial={false}
          className="text-center py-20"
        >
          <BookOpen className="mx-auto size-10 text-night-700 mb-4" />
          <p className="text-night-500 font-serif italic">Your nightmares haven't started yet.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-blood-500 hover:text-blood-400"
          >
            Generate your first story
            <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>
      ) : (
        <ul className="flex flex-col gap-3">
          <AnimatePresence>
            {stories.map((story, i) => (
              <motion.li
                key={story._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="group surface surface-hover p-4 flex items-start gap-4"
              >
                {/* Status dot */}
                <div className="mt-1.5 shrink-0">
                  {story.status === "ready" ? (
                    <span className="size-2 rounded-full bg-blood-600 block" />
                  ) : story.status === "generating" ? (
                    <span className="size-2 rounded-full bg-amber-500 block animate-pulse" />
                  ) : (
                    <span className="size-2 rounded-full bg-night-600 block" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-night-100 font-medium truncate">
                      {story.title}
                    </h3>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Toggle public */}
                      <IconButton
                        onClick={() => togglePublic({ storyId: story._id as Id<"stories"> })}
                        title={story.isPublic ? "Make private" : "Make public"}
                      >
                        {story.isPublic
                          ? <Globe className="size-3.5 text-blood-400" />
                          : <Lock  className="size-3.5 text-night-500" />
                        }
                      </IconButton>

                      {/* Delete */}
                      <IconButton
                        onClick={() => handleDelete(story._id as Id<"stories">)}
                        title="Delete"
                        disabled={deleting === story._id}
                      >
                        <Trash2 className="size-3.5 text-night-600 hover:text-blood-500" />
                      </IconButton>
                    </div>
                  </div>

                  <p className="text-xs text-night-600 mt-0.5 truncate">{story.prompt}</p>

                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-night-600">
                    <span>{story.sceneCount} scenes</span>
                    <span>·</span>
                    <span className="capitalize">{story.tone}</span>
                    <span>·</span>
                    <span>{story.playCount} plays</span>
                    <span>·</span>
                    <span>{formatDate(story.createdAt)}</span>
                  </div>
                </div>

                {/* Read link */}
                {story.status === "ready" && (
                  <Link
                    to="/story/$slug"
                    params={{ slug: story.slug }}
                    className="shrink-0 flex items-center gap-1 rounded-xl btn-ghost !py-1.5 !px-3 !text-xs"
                  >
                    Read
                    <ArrowRight className="size-3" />
                  </Link>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </main>
  )
}

function IconButton({
  onClick, title, disabled = false, children,
}: {
  onClick: () => void
  title: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="flex size-6 items-center justify-center rounded-md hover:bg-night-800 transition-colors disabled:opacity-40"
    >
      {children}
    </button>
  )
}
