// @ts-nocheck
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

const mood = v.union(
  v.literal("dread"),
  v.literal("chase"),
  v.literal("reveal"),
  v.literal("silence"),
  v.literal("descent"),
  v.literal("pulse"),
  v.literal("static"),
  v.literal("fog"),
)

const soundCue = v.union(
  v.literal("wind_low"),
  v.literal("heartbeat_low"),
  v.literal("heartbeat_high"),
  v.literal("static_burst"),
  v.literal("drip_cave"),
  v.literal("choir_dissonant"),
  v.literal("chase_strings"),
  v.literal("silence"),
  v.literal("breathing_close"),
  v.literal("deep_drone"),
  v.literal("door_creak"),
  v.literal("water_distant"),
)

export default defineSchema({
  ...authTables,

  // ── stories ──────────────────────────────────────────────────────────────
  stories: defineTable({
    userId:       v.id("users"),
    title:        v.string(),
    slug:         v.string(),
    prompt:       v.string(),
    theme:        v.string(),
    tone:         v.union(
                    v.literal("atmospheric"),
                    v.literal("psychological"),
                    v.literal("jumpscare"),
                    v.literal("graphic"),
                  ),
    length:       v.union(v.literal("short"), v.literal("medium"), v.literal("long")),
    status:       v.union(
                    v.literal("generating"),
                    v.literal("ready"),
                    v.literal("failed"),
                  ),
    sceneCount:   v.number(),
    wordCount:    v.number(),
    isPublic:     v.boolean(),
    playCount:    v.number(),
    createdAt:    v.number(),
    generatedAt:  v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  })
    .index("by_user",   ["userId", "createdAt"])
    .index("by_slug",   ["slug"])
    .index("by_public", ["isPublic", "playCount"]),

  // ── scenes ────────────────────────────────────────────────────────────────
  scenes: defineTable({
    storyId:         v.id("stories"),
    order:           v.number(),
    text:            v.string(),
    mood,
    soundCue,
    imagePrompt:     v.optional(v.string()),
    imageStorageId:  v.optional(v.id("_storage")),
    imageUrl:        v.optional(v.string()),
    wordCount:       v.number(),
    readingMs:       v.number(),
  })
    .index("by_story_order", ["storyId", "order"]),

  // ── playback_sessions ─────────────────────────────────────────────────────
  playback_sessions: defineTable({
    storyId:     v.id("stories"),
    userId:      v.optional(v.id("users")),
    startedAt:   v.number(),
    completedAt: v.optional(v.number()),
    sceneReached: v.number(),
  })
    .index("by_story", ["storyId"]),
})
