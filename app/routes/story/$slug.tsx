import { createFileRoute, notFound } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { StoryPlayer } from "~/components/player/StoryPlayer"
import { Link } from "@tanstack/react-router"
import { Sun, Ghost } from "lucide-react"
import { AppBrand } from "~/components/shared/AppBrand"
import { useTheme } from "~/lib/theme"
import type { Id } from "@convex/_generated/dataModel"

export const Route = createFileRoute("/story/$slug")({
  component: StoryPage,
})

function StoryPage() {
  const { slug } = Route.useParams()
  const { theme } = useTheme()
  const story    = useQuery(api.stories.getBySlug, { slug })

  if (story === undefined) {
    // Loading
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="animate-pulse text-3xl">💀</span>
      </div>
    )
  }

  if (story === null || story.status === "failed") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-serif text-xl text-blood-400">This story does not exist… or does it?</p>
        <Link to="/" className="text-sm text-night-500 hover:text-night-300 underline">
          Return home
        </Link>
      </div>
    )
  }

  if (story.status === "generating") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="animate-pulse text-3xl">💀</span>
      </div>
    )
  }

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
        >
          {theme === "light" ? <Sun className="size-3.5 text-ember-500" /> : <Ghost className="size-3.5" />}
          <AppBrand split />
        </Link>
      </nav>

      <StoryPlayer
        storyId={story._id as Id<"stories">}
        title={story.title}
        scenes={story.scenes as any}
        slug={slug}
      />
    </>
  )
}
