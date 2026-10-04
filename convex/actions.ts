// @ts-nocheck
import { v } from "convex/values"
import { internalAction } from "./_generated/server"
import { internal } from "./_generated/api"
import OpenAI from "openai"

const SYSTEM_PROMPT = `You are a master horror writer in the tradition of Shirley Jackson, Thomas Ligotti, and early Stephen King. You write atmospheric, psychological horror with precise, evocative language. You never use clichés without subverting them. You build dread slowly and leave endings ambiguous or deeply unsettling — never with cheap resolution.

You will receive a user prompt describing a horror story concept. You must respond ONLY with a valid JSON object matching this exact schema — no prose, no markdown, no explanation outside the JSON:

{
  "title": "<2-6 word evocative title, NOT a question>",
  "scenes": [
    {
      "text": "<scene prose>",
      "mood": "<one of: dread | chase | reveal | silence | descent | pulse | static | fog>",
      "imagePrompt": "<1-2 sentence image description for AI image generation. Desaturated, grainy, cinematic horror. No faces. Environment/objects/atmosphere only. Style: 35mm film grain, desaturated, heavy shadow, horror atmosphere>",
      "soundCue": "<one of: wind_low | heartbeat_low | heartbeat_high | static_burst | drip_cave | choir_dissonant | chase_strings | silence | breathing_close | deep_drone | door_creak | water_distant>"
    }
  ]
}

SCENE COUNT:
- short  (~300 words total): 4 scenes
- medium (~700 words total): 6 scenes
- long  (~1200 words total): 8 scenes

SCENE LENGTH:
- First scene (scene 0): establish setting and unease — 40-80 words
- Middle scenes: advance tension, never fully explain — 60-120 words each
- Final scene: twist, revelation, or ambiguous horror — 50-90 words. End mid-thought or with an image, never with resolution.

MOOD SELECTION RULES:
- Scene 0 is almost always "fog" or "silence"
- Escalate mood across scenes — do not spike then drop
- "chase" and "pulse" should appear at most once, near the end
- "reveal" is reserved for the penultimate or final scene only

SOUND CUE GUIDANCE:
- fog/silence → wind_low, water_distant, deep_drone
- dread/descent → heartbeat_low, breathing_close, drip_cave
- static → static_burst, door_creak
- chase → chase_strings, heartbeat_high
- pulse → heartbeat_high, choir_dissonant
- reveal → choir_dissonant, silence, deep_drone`

const TONE_MODIFIERS: Record<string, string> = {
  atmospheric:   "Lean into silence, negative space, slow dread. Avoid action. Prioritise texture and atmosphere.",
  psychological: "Blur the line between real and imagined. Unreliable narrator. Reality fractures subtly.",
  jumpscare:     "Build false safety, then snap. One sharp punctuation break per scene. Contrast quiet and sudden.",
  graphic:       "More visceral imagery permitted. Still prioritise craft over shock. Earned dread first.",
}

const SCENE_COUNTS: Record<string, number> = { short: 4, medium: 6, long: 8 }

/**
 * Scheduled from createStoryShell / retryGeneration — does not depend on the browser tab.
 */
export const generateStory = internalAction({
  args: {
    storyId: v.id("stories"),
  },
  handler: async (ctx, { storyId }) => {
    const story = await ctx.runQuery(internal.stories.getStoryForGeneration, { storyId })
    if (!story) return
    if (story.status !== "generating") return

    if (!process.env.OPENAI_API_KEY) {
      await ctx.runMutation(internal.stories.updateStoryStatus, {
        storyId,
        status: "failed",
        errorMessage: "OPENAI_API_KEY is not set in Convex environment variables.",
      })
      return
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const userMessage = [
      `USER PROMPT: ${story.prompt}`,
      `TONE: ${story.tone}`,
      `TONE MODIFIER: ${TONE_MODIFIERS[story.tone] ?? TONE_MODIFIERS.atmospheric}`,
      `LENGTH: ${story.length} (${SCENE_COUNTS[story.length] ?? 6} scenes)`,
      `THEME/SETTING: ${story.theme}`,
    ].join("\n")

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        temperature: 0.85,
        max_tokens: 3500,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: userMessage },
        ],
      })

      const raw = response.choices[0]?.message?.content ?? ""
      const parsed = JSON.parse(raw) as StoryJSON

      if (!parsed?.title || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
        throw new Error("AI returned an empty or invalid story payload.")
      }

      const sceneRows = parsed.scenes.map((s, i) => {
        if (!s?.text?.trim()) {
          throw new Error(`Scene ${i + 1} is missing text.`)
        }
        const wordCount = s.text.trim().split(/\s+/).length
        return {
          order:       i,
          text:        s.text.trim(),
          mood:        validateMood(s.mood),
          soundCue:    validateSoundCue(s.soundCue),
          imagePrompt: s.imagePrompt,
          wordCount,
          readingMs:   Math.round((wordCount / 200) * 60 * 1000),
        }
      })

      const totalWords = sceneRows.reduce((a, s) => a + s.wordCount, 0)

      await ctx.runMutation(internal.stories.saveScenes, {
        storyId,
        scenes: sceneRows,
      })

      await ctx.runMutation(internal.stories.updateStoryStatus, {
        storyId,
        status: "ready",
        title: parsed.title.trim() || "Untitled nightmare",
        sceneCount: sceneRows.length,
        wordCount: totalWords,
      })
    } catch (err) {
      await ctx.runMutation(internal.stories.updateStoryStatus, {
        storyId,
        status: "failed",
        errorMessage: err instanceof Error ? err.message : "Generation failed",
      })
    }
  },
})

interface StoryJSON {
  title: string
  scenes: {
    text: string
    mood: string
    imagePrompt: string
    soundCue: string
  }[]
}

const VALID_MOODS = ["dread","chase","reveal","silence","descent","pulse","static","fog"] as const
type Mood = typeof VALID_MOODS[number]

const VALID_CUES = [
  "wind_low","heartbeat_low","heartbeat_high","static_burst","drip_cave",
  "choir_dissonant","chase_strings","silence","breathing_close","deep_drone",
  "door_creak","water_distant",
] as const
type SoundCue = typeof VALID_CUES[number]

function validateMood(m: string): Mood {
  return VALID_MOODS.includes(m as Mood) ? (m as Mood) : "dread"
}

function validateSoundCue(c: string): SoundCue {
  return VALID_CUES.includes(c as SoundCue) ? (c as SoundCue) : "deep_drone"
}
