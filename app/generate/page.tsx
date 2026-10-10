import { GenerateClient } from "@/components/generate/GenerateClient"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{ storyId?: string; slug?: string }>
}

export default async function GeneratePage({ searchParams }: Props) {
  const { slug, storyId } = await searchParams
  if (!slug || !storyId) {
    redirect("/#generate")
  }
  return <GenerateClient slug={slug} />
}
