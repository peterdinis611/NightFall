# Nightfall 🌑

**AI-Powered Animated Scary Story Generator**

Generate cinematic horror stories with AI. Each story is an animated, atmospheric experience with typewriter text, mood-synced backgrounds, and ambient audio cross-fades.

## Stack

| Layer | Tech |
|-------|------|
| Framework | TanStack Start (React SSR, file-based routing) |
| Backend | Convex (realtime DB, storage, auth) |
| AI | OpenAI GPT-4o |
| Styling | Tailwind CSS v3 + shadcn-style components |
| Animation | Framer Motion |
| Auth | Convex Auth (GitHub, Google, Anonymous) |

## Project structure

```
nightfall/
├── app/
│   ├── routes/
│   │   ├── __root.tsx        # Root layout, Convex + auth wrapper
│   │   ├── index.tsx         # Home: prompt form
│   │   ├── generate.tsx      # Generating screen (polls Convex)
│   │   ├── library.tsx       # User story library
│   │   └── story/$slug.tsx   # Story player
│   ├── components/
│   │   ├── prompt/           # PromptForm, ToneSelector, LengthSelector, ThemeGrid
│   │   ├── player/           # StoryPlayer, SceneBackground, SceneText, SceneAudio, PlaybackBar
│   │   └── shared/           # ContentWarning modal
│   ├── lib/utils.ts          # Helpers (cn, mood colours, etc.)
│   └── styles/globals.css    # Dark horror theme
├── convex/
│   ├── schema.ts             # stories, scenes, playback_sessions tables
│   ├── stories.ts            # Queries + mutations
│   ├── actions.ts            # OpenAI story generation action
│   └── auth.ts               # Convex Auth config
├── vite.config.ts
└── .env.example
```

## Getting started

### 1. Clone and install

```bash
cd nightfall
npm install
```

### 2. Create a Convex project

```bash
npx convex dev
```

This generates `convex/_generated/` and starts the Convex dev server.

### 3. Set environment variables

Copy `.env.example` to `.env` and fill in:

```bash
VITE_CONVEX_URL=https://your-project.convex.cloud
OPENAI_API_KEY=sk-...
# Optional: GitHub/Google OAuth
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
SITE_URL=http://localhost:3000
```

Set `OPENAI_API_KEY` and auth secrets also in the Convex dashboard under **Environment Variables**.

### 4. Run dev server

```bash
npm run dev          # Vite + TanStack Start
npm run convex:dev   # Convex backend (separate terminal)
```

Open [http://localhost:3000](http://localhost:3000)

## Story moods & animations

| Mood | Background | Text style | Sound |
|------|-----------|------------|-------|
| `fog` | Drifting blue mist | Mist-coloured serif | wind_low |
| `silence` | Near-black radial | Wide tracking | deep_drone |
| `dread` | Purple-black gradient | Standard serif | heartbeat_low |
| `descent` | Deep violet pulse | Fade-down serif | breathing_close |
| `static` | Animated noise | JetBrains Mono | static_burst |
| `pulse` | Red heartbeat | Uppercase blood-red | heartbeat_high |
| `chase` | Jittering dark | Left-aligned sharp | chase_strings |
| `reveal` | Dark brightening | Italic dimmed | choir_dissonant |

## Audio

Place ambient audio files in `public/audio/` (WAV format). Generate them with:

```bash
npm run generate:audio
```

```
public/audio/
  wind_low.wav
  heartbeat_low.wav
  heartbeat_high.wav
  static_burst.wav
  drip_cave.wav
  choir_dissonant.wav
  chase_strings.wav
  breathing_close.wav
  deep_drone.wav
  door_creak.wav
  water_distant.wav
```

Audio is optional — stories work fine without it. The `SceneAudio` component cross-fades between scenes at 35% volume.

## Build

```bash
npm run build   # Production build → dist/
npm run start   # Serve production build
```
