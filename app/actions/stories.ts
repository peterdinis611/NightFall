"use server"

import { fetchMutation } from "convex/nextjs"
import { api } from "@convex/_generated/api"
import { redirect } from "next/navigation"
import type { Id } from "@convex/_generated/dataModel"
import { authActionClient } from "@/lib/safe-action"
import { createStorySchema, retryStorySchema } from "@/lib/storySchemas"
import { isNextRedirect, unwrapConvexError } from "@/lib/errors"

export type { CreateStoryInput } from "@/lib/storySchemas"

/** Orchestration only — generation stays on Convex. */
export const createStoryAction = authActionClient
  .inputSchema(createStorySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await fetchMutation(
        api.stories.createStoryShell,
        {
          prompt: parsedInput.prompt,
          theme: parsedInput.theme || parsedInput.prompt,
          tone: parsedInput.tone,
          length: parsedInput.length,
          ...(parsedInput.parentStoryId
            ? { parentStoryId: parsedInput.parentStoryId as Id<"stories"> }
            : {}),
        },
        { token: ctx.token, url: ctx.convexUrl },
      )
      redirect(`/generate?storyId=${result.storyId}&slug=${result.slug}`)
    } catch (err) {
      if (isNextRedirect(err)) throw err
      throw new Error(unwrapConvexError(err))
    }
  })

export const retryStoryAction = authActionClient
  .inputSchema(retryStorySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await fetchMutation(
        api.stories.retryGeneration,
        { storyId: parsedInput.storyId as Id<"stories"> },
        { token: ctx.token, url: ctx.convexUrl },
      )
      redirect(`/generate?storyId=${result.storyId}&slug=${result.slug}`)
    } catch (err) {
      if (isNextRedirect(err)) throw err
      throw new Error(unwrapConvexError(err))
    }
  })
