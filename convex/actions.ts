// @ts-nocheck
import { v } from "convex/values"
import { action } from "./_generated/server"
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

// ── Story generation action ────────────────────────────────────────────────

export const generateStory = action({
  args: {
    storyId: v.id("stories"),
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
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const userMessage = [
      `USER PROMPT: ${args.prompt}`,
      `TONE: ${args.tone}`,
      `TONE MODIFIER: ${TONE_MODIFIERS[args.tone]}`,
      `LENGTH: ${args.length} (${SCENE_COUNTS[args.length]} scenes)`,
      `THEME/SETTING: ${args.theme}`,
    ].join("\n")

    let parsed: StoryJSON | null = null

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
      parsed = JSON.parse(raw) as StoryJSON
    } catch (err) {
      await ctx.runMutation(internal.stories.updateStoryStatus, {
        storyId: args.storyId,
        status: "failed",
        errorMessage: err instanceof Error ? err.message : "Generation failed",
      })
      return
    }

    // Build scene rows
    const sceneRows = parsed.scenes.map((s, i) => {
      const wordCount = s.text.split(/\s+/).length
      return {
        order:       i,
        text:        s.text,
        mood:        validateMood(s.mood),
        soundCue:    validateSoundCue(s.soundCue),
        imagePrompt: s.imagePrompt,
        wordCount,
        readingMs:   Math.round((wordCount / 200) * 60 * 1000), // 200 wpm
      }
    })

    const totalWords = sceneRows.reduce((a, s) => a + s.wordCount, 0)

    await ctx.runMutation(internal.stories.saveScenes, {
      storyId: args.storyId,
      scenes:  sceneRows,
    })

    await ctx.runMutation(internal.stories.updateStoryStatus, {
      storyId:   args.storyId,
      status:    "ready",
      title:     parsed.title,
      sceneCount: sceneRows.length,
      wordCount:  totalWords,
    })
  },
})

// ── Type helpers ────────────────────────────────────────────────────────────

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
