import { StoryClient } from "@/components/story/StoryClient"
import { getPublicStoryBySlug } from "@/lib/convexServer"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const story = await getPublicStoryBySlug(slug)
  if (!story || story.status !== "ready") {
    return { title: "Nightfall" }
  }
  return {
    title: `${story.title} — Nightfall`,
    description: story.prompt.slice(0, 140),
  }
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params
  // Warm the RSC cache for public/ready stories; client query stays authoritative.
  void getPublicStoryBySlug(slug)
  return <StoryClient slug={slug} />
}
