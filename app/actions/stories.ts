"use server"

import { fetchMutation } from "convex/nextjs"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@convex/_generated/api"
import { redirect } from "next/navigation"
import { z } from "zod"
import type { Id } from "@convex/_generated/dataModel"
import { CONVEX_URL } from "@/lib/convex"

const createSchema = z.object({
  prompt: z.string().trim().min(1).max(400),
  theme: z.string().trim().max(200).optional().default(""),
  tone: z.enum(["atmospheric", "psychological", "jumpscare", "graphic"]),
  length: z.enum(["short", "medium", "long"]),
})

export type CreateStoryInput = z.infer<typeof createSchema>

function unwrapConvexError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  if (raw.includes("[CONVEX")) {
    return raw.match(/Uncaught Error: ([^\n]+)/)?.[1] ?? raw
  }
  return raw
}

/** Orchestration only — generation stays on Convex. */
export async function createStoryAction(input: CreateStoryInput) {
  const parsed = createSchema.parse(input)
  const token = await convexAuthNextjsToken()
  if (!token) {
    throw new Error("Authentication required")
  }

  try {
    const result = await fetchMutation(
      api.stories.createStoryShell,
      {
        prompt: parsed.prompt,
        theme: parsed.theme || parsed.prompt,
        tone: parsed.tone,
        length: parsed.length,
      },
      { token, url: CONVEX_URL },
    )
    redirect(`/generate?storyId=${result.storyId}&slug=${result.slug}`)
  } catch (err) {
    // redirect() throws a special Next error — rethrow it
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err
    }
    throw new Error(unwrapConvexError(err))
  }
}

export async function retryStoryAction(storyId: string) {
  const token = await convexAuthNextjsToken()
  if (!token) {
    throw new Error("Authentication required")
  }

  try {
    const result = await fetchMutation(
      api.stories.retryGeneration,
      { storyId: storyId as Id<"stories"> },
      { token, url: CONVEX_URL },
    )
    redirect(`/generate?storyId=${result.storyId}&slug=${result.slug}`)
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err
    }
    throw new Error(unwrapConvexError(err))
  }
}
