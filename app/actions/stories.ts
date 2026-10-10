"use server"

import { fetchMutation } from "convex/nextjs"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@convex/_generated/api"
import { redirect } from "next/navigation"
import { z } from "zod"
import type { Id } from "@convex/_generated/dataModel"
import { CONVEX_URL } from "@/lib/convex"
import { isNextRedirect, unwrapConvexError } from "@/lib/errors"

const createSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required").max(400, "Prompt must be 400 characters or fewer"),
  theme: z.string().trim().max(200).optional().default(""),
  tone: z.enum(["atmospheric", "psychological", "jumpscare", "graphic"]),
  length: z.enum(["short", "medium", "long"]),
})

export type CreateStoryInput = z.infer<typeof createSchema>

function requireConvexUrl() {
  if (!CONVEX_URL) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL — set it in .env.local")
  }
  return CONVEX_URL
}

function mapActionError(err: unknown): never {
  if (isNextRedirect(err)) throw err
  if (err instanceof z.ZodError) {
    throw new Error(err.errors[0]?.message ?? "Invalid input")
  }
  throw new Error(unwrapConvexError(err))
}

/** Orchestration only — generation stays on Convex. */
export async function createStoryAction(input: CreateStoryInput) {
  const parsed = (() => {
    try {
      return createSchema.parse(input)
    } catch (err) {
      return mapActionError(err)
    }
  })()

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
      { token, url: requireConvexUrl() },
    )
    redirect(`/generate?storyId=${result.storyId}&slug=${result.slug}`)
  } catch (err) {
    mapActionError(err)
  }
}

export async function retryStoryAction(storyId: string) {
  if (!storyId?.trim()) {
    throw new Error("Missing story id")
  }

  const token = await convexAuthNextjsToken()
  if (!token) {
    throw new Error("Authentication required")
  }

  try {
    const result = await fetchMutation(
      api.stories.retryGeneration,
      { storyId: storyId as Id<"stories"> },
      { token, url: requireConvexUrl() },
    )
    redirect(`/generate?storyId=${result.storyId}&slug=${result.slug}`)
  } catch (err) {
    mapActionError(err)
  }
}
