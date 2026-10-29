// @ts-nocheck
import { v } from "convex/values"
import { mutation, query, internalMutation, internalQuery } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"
import { internal } from "./_generated/api"
import { assertCanCreateStory, assertCanRetryGeneration } from "./rateLimit"

// ── Queries ────────────────────────────────────────────────────────────────

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const story = await ctx.db
      .query("stories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()
    if (!story) return null

    const userId = await getAuthUserId(ctx)
    const isOwner = Boolean(userId && story.userId === userId)
    const isPublicReady = story.isPublic && story.status === "ready"

    // Private / incomplete stories are owner-only
    if (!isOwner && !isPublicReady) return null

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

    return { ...story, scenes: resolvedScenes, isOwner }
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

    const ready = results.page.filter((s) => s.status === "ready")
    return {
      stories: ready.map((s) => ({
        _id: s._id,
        title: s.title,
        slug: s.slug,
        prompt: s.prompt,
        theme: s.theme,
        tone: s.tone,
        length: s.length,
        sceneCount: s.sceneCount,
        wordCount: s.wordCount,
        playCount: s.playCount,
        createdAt: s.createdAt,
        parentStoryId: s.parentStoryId ?? null,
      })),
      cursor: results.continueCursor,
      isDone: results.isDone,
    }
  },
})

/** Internal: used by scheduled generateStory action */
export const getStoryForGeneration = internalQuery({
  args: { storyId: v.id("stories") },
  handler: async (ctx, { storyId }) => {
    const story = await ctx.db.get(storyId)
    if (!story) return null

    let parentContext: {
      title: string
      prompt: string
      lastScenes: string[]
    } | null = null

    if (story.parentStoryId) {
      const parent = await ctx.db.get(story.parentStoryId)
      if (parent && parent.status === "ready") {
        const parentScenes = await ctx.db
          .query("scenes")
          .withIndex("by_story_order", (q) => q.eq("storyId", parent._id))
          .collect()
        const last = parentScenes.slice(-3).map((s) => s.text)
        parentContext = {
          title: parent.title,
          prompt: parent.prompt,
          lastScenes: last,
        }
      }
    }

    return { ...story, parentContext }
  },
})

export const listScenesForImages = internalQuery({
  args: { storyId: v.id("stories") },
  handler: async (ctx, { storyId }) => {
    return await ctx.db
      .query("scenes")
      .withIndex("by_story_order", (q) => q.eq("storyId", storyId))
      .collect()
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
    parentStoryId: v.optional(v.id("stories")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Authentication required")

    let prompt = args.prompt.trim()
    let theme = args.theme.trim()
    let tone = args.tone
    let length = args.length
    let parentStoryId = args.parentStoryId

    if (parentStoryId) {
      const parent = await ctx.db.get(parentStoryId)
      if (!parent) throw new Error("Parent story not found")
      const isOwner = parent.userId === userId
      const isPublicReady = parent.isPublic && parent.status === "ready"
      if (!isOwner && !isPublicReady) throw new Error("Cannot continue this story")
      if (parent.status !== "ready") throw new Error("Parent story is not ready")

      tone = parent.tone
      length = parent.length
      theme = theme || parent.theme
      if (!prompt) {
        prompt = `Continue "${parent.title}". Deepen what was left unfinished.`
      }
    }

    if (!prompt) throw new Error("Prompt is required")
    if (prompt.length > 400) throw new Error("Prompt must be 400 characters or fewer")

    await assertCanCreateStory(ctx, userId)

    const slug = generateSlug()

    const storyId = await ctx.db.insert("stories", {
      userId,
      title:       "Generating…",
      slug,
      prompt,
      theme:       theme || prompt,
      tone,
      length,
      status:      "generating",
      sceneCount:  0,
      wordCount:   0,
      isPublic:    false,
      playCount:   0,
      createdAt:   Date.now(),
      parentStoryId,
    })

    await ctx.scheduler.runAfter(0, internal.actions.generateStory, { storyId })

    return { storyId, slug }
  },
})

/** Re-queue a failed (or stuck generating) story owned by the user */
export const retryGeneration = mutation({
  args: { storyId: v.id("stories") },
  handler: async (ctx, { storyId }) => {
    const userId = await getAuthUserId(ctx)
    const story = await ctx.db.get(storyId)
    if (!userId || !story || story.userId !== userId) {
      throw new Error("Unauthorized")
    }
    if (story.status === "ready") {
      throw new Error("Story is already ready")
    }

    await assertCanRetryGeneration(ctx, userId)

    // Clear any partial scenes from a previous failed attempt
    const existing = await ctx.db
      .query("scenes")
      .withIndex("by_story_order", (q) => q.eq("storyId", storyId))
      .collect()
    await Promise.all(existing.map((s) => ctx.db.delete(s._id)))

    await ctx.db.patch(storyId, {
      status: "generating",
      title: "Generating…",
      errorMessage: undefined,
      sceneCount: 0,
      wordCount: 0,
    })

    await ctx.scheduler.runAfter(0, internal.actions.generateStory, { storyId })
    return { storyId, slug: story.slug }
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
    const ids = await Promise.all(
      scenes.map((scene) => ctx.db.insert("scenes", { storyId, ...scene }))
    )
    return { sceneIds: ids }
  },
})

export const attachSceneImage = internalMutation({
  args: {
    sceneId: v.id("scenes"),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, { sceneId, imageStorageId }) => {
    const scene = await ctx.db.get(sceneId)
    if (!scene) return
    if (scene.imageStorageId) {
      await ctx.storage.delete(scene.imageStorageId)
    }
    await ctx.db.patch(sceneId, { imageStorageId })
  },
})

export const togglePublic = mutation({
  args: { storyId: v.id("stories") },
  handler: async (ctx, { storyId }) => {
    const userId = await getAuthUserId(ctx)
    const story  = await ctx.db.get(storyId)
    if (!story || story.userId !== userId) throw new Error("Unauthorized")
    if (story.status !== "ready") {
      throw new Error("Only ready stories can be made public")
    }
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

    const isOwner = Boolean(userId && story.userId === userId)
    if (!isOwner && !(story.isPublic && story.status === "ready")) {
      throw new Error("Unauthorized")
    }

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

/** Anonymous guest: mint a one-time claim so stories can move to a real account */
export const issueAccountClaim = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Authentication required")
    const user = await ctx.db.get(userId)
    if (!user?.isAnonymous) {
      throw new Error("Only guest sessions can issue a claim")
    }

    // Replace any prior claim for this guest
    const existing = await ctx.db
      .query("account_claims")
      .withIndex("by_from_user", (q) => q.eq("fromUserId", userId))
      .collect()
    await Promise.all(existing.map((c) => ctx.db.delete(c._id)))

    const token = generateClaimToken()
    const tokenHash = await sha256Hex(token)
    await ctx.db.insert("account_claims", {
      tokenHash,
      fromUserId: userId,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      createdAt: Date.now(),
    })
    return { token }
  },
})

/** After sign-up / sign-in: move guest stories onto the permanent account */
export const redeemAccountClaim = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Authentication required")
    const user = await ctx.db.get(userId)
    if (!user || user.isAnonymous) {
      throw new Error("Sign in with a permanent account first")
    }

    const tokenHash = await sha256Hex(token.trim())
    const claim = await ctx.db
      .query("account_claims")
      .withIndex("by_token", (q) => q.eq("tokenHash", tokenHash))
      .unique()

    if (!claim) throw new Error("Claim expired or invalid")
    if (claim.expiresAt < Date.now()) {
      await ctx.db.delete(claim._id)
      throw new Error("Claim expired or invalid")
    }
    if (claim.fromUserId === userId) {
      await ctx.db.delete(claim._id)
      return { moved: 0 }
    }

    const guestStories = await ctx.db
      .query("stories")
      .withIndex("by_user", (q) => q.eq("userId", claim.fromUserId))
      .collect()

    await Promise.all(
      guestStories.map((s) => ctx.db.patch(s._id, { userId }))
    )
    await ctx.db.delete(claim._id)
    return { moved: guestStories.length }
  },
})

// ── Helpers ────────────────────────────────────────────────────────────────

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function generateClaimToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
