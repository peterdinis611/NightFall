import { cache } from "react"
import { fetchQuery } from "convex/nextjs"
import { api } from "@convex/_generated/api"
import { CONVEX_URL } from "@/lib/convex"

/**
 * Deduped per-request Convex reads for RSC.
 * Safe for public story shells — client still hydrates live Convex state.
 */
export const getPublicStoryBySlug = cache(async (slug: string) => {
  if (!CONVEX_URL || !slug) return null
  try {
    return await fetchQuery(
      api.stories.getBySlug,
      { slug },
      { url: CONVEX_URL },
    )
  } catch {
    return null
  }
})
