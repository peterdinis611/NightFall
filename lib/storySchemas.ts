import { z } from "zod"

export const createStorySchema = z.object({
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

export const retryStorySchema = z.object({
  storyId: z.string().trim().min(1, "Missing story id"),
})

export type CreateStoryInput = z.infer<typeof createStorySchema>
