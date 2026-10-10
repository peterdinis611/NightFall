import { StoryClient } from "@/components/story/StoryClient"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params
  return <StoryClient slug={slug} />
}
