# Nightfall 🌑

**AI-Powered Animated Scary Story Generator**

Generate cinematic horror stories with AI. Each story is an animated, atmospheric experience with typewriter text, mood-synced backgrounds, and ambient audio cross-fades.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite + React SPA (TanStack Router) |
| Backend | Convex (realtime DB, actions, auth) |
| AI | OpenAI GPT-4o |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion + CSS |
| Auth | Convex Auth (Password, GitHub, Google, Anonymous guest) |

## Project structure

```
nightfall/
├── app/
│   ├── routes/               # File-based routes
│   ├── components/
│   │   ├── landing/          # Hero, marquee, features, horror FX
│   │   ├── prompt/           # PromptForm, selectors
│   │   ├── player/           # Story player stack
│   │   ├── auth/             # AuthForm
│   │   └── shared/
│   ├── lib/                  # Theme, auth helpers, audio
│   ├── db/                   # Client auth token storage
│   └── styles/globals.css
├── convex/
│   ├── schema.ts
│   ├── stories.ts            # Queries, mutations, scheduler kickoff
│   ├── actions.ts            # Internal OpenAI generation action
│   ├── auth.ts
│   ├── auth.config.ts        # JWT provider (required for Convex Auth)
│   └── http.ts
├── public/audio/             # Scene ambient WAVs
├── scripts/generate-audio.mjs
└── .env.example
```

## Getting started

### 1. Install

```bash
npm install
```

### 2. Convex project

```bash
npx convex dev
```

This creates `convex.json`, generates `convex/_generated/`, and prints your deployment URL.

### 3. Environment

Copy `.env.example` → `.env.local`:

```bash
VITE_CONVEX_URL=https://your-project.convex.cloud
```

Set **Convex dashboard → Settings → Environment Variables** (backend) — not only `.env.local`:

| Variable | Required | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | **Yes** | Must be on the Convex deployment (`npx convex env set OPENAI_API_KEY …`). A key in `.env.local` alone will not generate stories. |
| `SITE_URL` | **Yes** | e.g. `http://localhost:3000` |
| `JWT_PRIVATE_KEY` / `JWKS` | **Yes** | Run `npm run auth:setup` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Optional | GitHub OAuth |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Optional | Google OAuth |

`convex/auth.config.ts` must exist so Convex can validate auth JWTs.

```bash
npm run auth:setup   # writes JWT keys + SITE_URL to Convex
```

### 4. Run (two terminals)

```bash
npm run convex:dev   # Convex backend
npm run dev          # Vite on http://localhost:3000
```

### 5. Audio (optional)

Scene audio WAVs ship in `public/audio/`. Regenerate with:

```bash
npm run generate:audio
```

## How generation works

1. User submits the prompt form (signed-in or **guest**).
2. `createStoryShell` inserts a `generating` story and **schedules** `internal.actions.generateStory` on Convex.
3. Generation continues even if the browser tab closes.
4. `/generate` polls `getBySlug` until `ready` or `failed`, then redirects to the player.
5. Library can **Resume** generating stories or **Retry** failed ones.

## Privacy

- New stories are **private** by default.
- Owners can toggle public from the library (ready stories only).
- `getBySlug` returns a story only if it is **public + ready**, or the viewer is the **owner**.

## Scripts

```bash
npm run dev              # Vite SPA
npm run build            # Production build → dist/
npm run start            # Preview production build
npm run convex:dev       # Convex local sync
npm run convex:deploy    # Deploy Convex
npm run auth:setup       # JWT + SITE_URL on Convex
npm run generate:audio   # Rebuild public/audio WAVs
npm test                 # Vitest
```

## Story moods

| Mood | Sound cue (typical) |
|------|---------------------|
| `fog` | wind_low |
| `silence` | deep_drone |
| `dread` | heartbeat_low |
| `descent` | breathing_close |
| `static` | static_burst |
| `pulse` | heartbeat_high |
| `chase` | chase_strings |
| `reveal` | choir_dissonant |
