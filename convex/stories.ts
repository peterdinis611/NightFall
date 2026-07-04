// @ts-nocheck
import { v } from "convex/values"
import { mutation, query, internalMutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

// ── Queries ────────────────────────────────────────────────────────────────

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const story = await ctx.db
      .query("stories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()
    if (!story) return null

    const scenes = await ctx.db
      .query("scenes")
      .withIndex("by_story_order", (q) => q.eq("storyId", story._id))
      .collect()

    const resolvedScenes = await Promise.all(
      scenes.map(async (scene) => ({
        ...scene,
        imageUrl: scene.imageStorageId
          ? await ctx.storage.getUrl(scene.imageStorageId)
          : null,
      }))
    )

    return { ...story, scenes: resolvedScenes }
  },
})

export const getUserStories = query({
  args: { cursor: v.optional(v.string()) },
  handler: async (ctx, { cursor }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return { stories: [], cursor: null }

    const results = await ctx.db
      .query("stories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate({ cursor: cursor ?? null, numItems: 12 })

    return {
      stories: results.page,
      cursor: results.continueCursor,
    }
  },
})

export const getPublicGallery = query({
  args: { cursor: v.optional(v.string()) },
  handler: async (ctx, { cursor }) => {
    const results = await ctx.db
      .query("stories")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .paginate({ cursor: cursor ?? null, numItems: 20 })

    return {
      stories: results.page,
      cursor: results.continueCursor,
    }
  },
})

// ── Mutations ──────────────────────────────────────────────────────────────

export const createStoryShell = mutation({
  args: {
    prompt:  v.string(),
    theme:   v.string(),
    tone:    v.union(
               v.literal("atmospheric"),
               v.literal("psychological"),
               v.literal("jumpscare"),
               v.literal("graphic"),
             ),
    length:  v.union(v.literal("short"), v.literal("medium"), v.literal("long")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Authentication required")

    // Rate limit: max 5 stories per hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recent = await ctx.db
      .query("stories")
      .withIndex("by_user", (q) =>
        q.eq("userId", userId).gte("createdAt", oneHourAgo)
      )
      .collect()

    if (recent.length >= 5) {
      throw new Error("Rate limit: max 5 stories per hour. Try again later.")
    }

    const slug = generateSlug()

    const storyId = await ctx.db.insert("stories", {
      userId,
      title:       "Generating…",
      slug,
      prompt:      args.prompt,
      theme:       args.theme,
      tone:        args.tone,
      length:      args.length,
      status:      "generating",
      sceneCount:  0,
      wordCount:   0,
      isPublic:    false,
      playCount:   0,
      createdAt:   Date.now(),
    })

    return { storyId, slug }
  },
})

export const updateStoryStatus = internalMutation({
  args: {
    storyId:      v.id("stories"),
    status:       v.union(v.literal("ready"), v.literal("failed")),
    title:        v.optional(v.string()),
    sceneCount:   v.optional(v.number()),
    wordCount:    v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.storyId, {
      status:       args.status,
      title:        args.title,
      sceneCount:   args.sceneCount,
      wordCount:    args.wordCount,
      errorMessage: args.errorMessage,
      generatedAt:  args.status === "ready" ? Date.now() : undefined,
    })
  },
})

export const saveScenes = internalMutation({
  args: {
    storyId: v.id("stories"),
    scenes: v.array(v.object({
      order:       v.number(),
      text:        v.string(),
      mood:        v.union(
                     v.literal("dread"),   v.literal("chase"),
                     v.literal("reveal"),  v.literal("silence"),
                     v.literal("descent"), v.literal("pulse"),
                     v.literal("static"),  v.literal("fog"),
                   ),
      soundCue:    v.union(
                     v.literal("wind_low"),         v.literal("heartbeat_low"),
                     v.literal("heartbeat_high"),   v.literal("static_burst"),
                     v.literal("drip_cave"),        v.literal("choir_dissonant"),
                     v.literal("chase_strings"),    v.literal("silence"),
                     v.literal("breathing_close"),  v.literal("deep_drone"),
                     v.literal("door_creak"),       v.literal("water_distant"),
                   ),
      imagePrompt: v.optional(v.string()),
      wordCount:   v.number(),
      readingMs:   v.number(),
    })),
  },
  handler: async (ctx, { storyId, scenes }) => {
    await Promise.all(
      scenes.map((scene) =>
        ctx.db.insert("scenes", { storyId, ...scene })
      )
    )
  },
})

export const togglePublic = mutation({
  args: { storyId: v.id("stories") },
  handler: async (ctx, { storyId }) => {
    const userId = await getAuthUserId(ctx)
    const story  = await ctx.db.get(storyId)
    if (!story || story.userId !== userId) throw new Error("Unauthorized")
    await ctx.db.patch(storyId, { isPublic: !story.isPublic })
    return { isPublic: !story.isPublic, slug: story.slug }
  },
})

export const deleteStory = mutation({
  args: { storyId: v.id("stories") },
  handler: async (ctx, { storyId }) => {
    const userId = await getAuthUserId(ctx)
    const story  = await ctx.db.get(storyId)
    if (!story || story.userId !== userId) throw new Error("Unauthorized")

    const scenes = await ctx.db
      .query("scenes")
      .withIndex("by_story_order", (q) => q.eq("storyId", storyId))
      .collect()

    await Promise.all([
      ...scenes.map(async (s) => {
        if (s.imageStorageId) await ctx.storage.delete(s.imageStorageId)
        await ctx.db.delete(s._id)
      }),
      ctx.db.delete(storyId),
    ])
  },
})

export const recordPlay = mutation({
  args: { storyId: v.id("stories") },
  handler: async (ctx, { storyId }) => {
    const userId = await getAuthUserId(ctx)
    const story  = await ctx.db.get(storyId)
    if (!story) return

    await ctx.db.patch(storyId, { playCount: story.playCount + 1 })
    return await ctx.db.insert("playback_sessions", {
      storyId,
      userId:      userId ?? undefined,
      startedAt:   Date.now(),
      sceneReached: 0,
    })
  },
})

export const updatePlaySession = mutation({
  args: {
    sessionId:   v.id("playback_sessions"),
    sceneReached: v.number(),
    completed:   v.boolean(),
  },
  handler: async (ctx, { sessionId, sceneReached, completed }) => {
    await ctx.db.patch(sessionId, {
      sceneReached,
      completedAt: completed ? Date.now() : undefined,
    })
  },
})

// ── Helpers ────────────────────────────────────────────────────────────────

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}
