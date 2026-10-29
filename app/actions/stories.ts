"use server"

import { fetchMutation } from "convex/nextjs"
import { api } from "@convex/_generated/api"
import { redirect } from "next/navigation"
import { z } from "zod"
import type { Id } from "@convex/_generated/dataModel"
import { authActionClient } from "@/lib/safe-action"
import { isNextRedirect, unwrapConvexError } from "@/lib/errors"

const createSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(400, "Prompt must be 400 characters or fewer"),
  theme: z.string().trim().max(200).optional().default(""),
  tone: z.enum(["atmospheric", "psychological", "jumpscare", "graphic"]),
  length: z.enum(["short", "medium", "long"]),
  parentStoryId: z.string().optional(),
})

const retrySchema = z.object({
  storyId: z.string().trim().min(1, "Missing story id"),
})

export type CreateStoryInput = z.infer<typeof createSchema>

/** Orchestration only — generation stays on Convex. */
export const createStoryAction = authActionClient
  .inputSchema(createSchema)
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
  .inputSchema(retrySchema)
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
