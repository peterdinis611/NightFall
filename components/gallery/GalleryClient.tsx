"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { BookOpen, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { LoadingScreen } from "@/components/shared/LoadingScreen"

export function GalleryClient() {
  const result = useQuery(api.stories.getPublicGallery, {})

  if (result === undefined) {
    return <LoadingScreen message="Opening the sealed shelves…" />
  }

  const stories = result.stories ?? []

  return (
    <main className="min-h-screen px-5 py-16 pt-28 max-w-3xl mx-auto">
      <div className="mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-fg leading-tight mb-3">
          Explore
        </h1>
        <p className="text-muted text-sm max-w-[40ch] leading-relaxed">
          Stories other readers chose to seal in public. Open one — or leave it shut.
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="border-t border-[var(--border)] pt-10">
          <BookOpen className="size-8 text-muted mb-4 opacity-50" />
          <p className="font-serif text-xl text-fg mb-2">Nothing sealed yet</p>
          <p className="text-muted text-sm mb-6 max-w-[32ch]">
            When someone marks a story public from their library, it appears here.
          </p>
          <Link
            href="/#generate"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--blood)] hover:underline underline-offset-4"
          >
            Write the first one
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <ul className="border-t border-[var(--border)]">
          {stories.map((story) => (
            <li key={story._id} className="border-b border-[var(--border)] py-6">
              <Link
                href={`/story/${story.slug}`}
                className="group block space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-serif text-xl sm:text-2xl text-fg group-hover:opacity-70 transition-opacity leading-snug">
                    {story.title}
                  </h2>
                  <span className="shrink-0 font-mono text-[10px] text-muted tabular-nums pt-2">
                    {story.playCount} {story.playCount === 1 ? "read" : "reads"}
                  </span>
                </div>
                <p className="text-muted text-sm leading-relaxed line-clamp-2 max-w-xl">
                  {story.prompt}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted/70">
                  {story.tone} · {story.sceneCount} scenes · {formatDate(story.createdAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
