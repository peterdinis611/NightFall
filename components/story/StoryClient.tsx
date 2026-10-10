"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { StoryPlayer } from "@/components/player/StoryPlayer"
import { Sun, Ghost } from "lucide-react"
import { AppBrand } from "@/components/shared/AppBrand"
import { useTheme } from "@/lib/theme"
import type { Id } from "@convex/_generated/dataModel"
import { BloodSpinner } from "@/components/shared/BloodSpinner"

export function StoryClient({ slug }: { slug: string }) {
  const { theme } = useTheme()
  const story = useQuery(api.stories.getBySlug, { slug })

  if (story === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <BloodSpinner size="md" label="Opening the story…" />
      </div>
    )
  }

  if (story === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-serif text-xl text-blood-400">This story does not exist… or does it?</p>
        <p className="text-sm text-muted max-w-sm">
          It may be private, still forming, or lost to the void.
        </p>
        <Link href="/" className="text-sm text-muted hover:text-fg underline">
          Return home
        </Link>
      </div>
    )
  }

  if (story.status === "failed") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-serif text-xl text-blood-400">The ritual failed</p>
        <Link
          href={`/generate?storyId=${story._id}&slug=${slug}`}
          className="text-sm text-muted hover:text-fg underline"
        >
          Check generation status
        </Link>
      </div>
    )
  }

  if (story.status === "generating") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <BloodSpinner size="md" label="Still summoning…" />
        <Link
          href={`/generate?storyId=${story._id}&slug=${slug}`}
          className="text-sm text-blood-500 hover:text-blood-400 underline"
        >
          Watch the ritual
        </Link>
      </div>
    )
  }

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
        >
          {theme === "light" ? (
            <Sun className="size-3.5 text-ember-500" />
          ) : (
            <Ghost className="size-3.5" />
          )}
          <AppBrand split />
        </Link>
      </nav>

      <StoryPlayer
        storyId={story._id as Id<"stories">}
        title={story.title}
        scenes={story.scenes as never}
        slug={slug}
      />
    </>
  )
}
