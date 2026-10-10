# Nightfall

AI horror story generator. **Next.js App Router** frontend + **Convex** backend (auth, DB, generation, rate limits).

## Setup

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_CONVEX_URL to your Convex deployment URL
# Set SITE_URL=http://localhost:3000
npx convex dev   # syncs env + generates types (separate terminal)
npm run auth:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Convex env (dashboard or CLI)

- `OPENAI_API_KEY` — story generation
- `SITE_URL` — auth redirects (`http://localhost:3000` locally)
- Auth providers via `npx @convex-dev/auth`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run convex:dev` | Convex backend + codegen |
| `npm run auth:setup` | Configure Convex Auth |
| `npm test` | Vitest unit tests |

## Architecture

- **Server Actions** (`app/actions/stories.ts`) — thin orchestration: validate → Convex mutation → redirect
- **Client** — Convex React hooks for live story status, library, rate-limit UI
- **Convex** — `createStoryShell`, scheduled `generateStory`, auth, rate limits

Routes: `/`, `/auth`, `/generate`, `/library`, `/story/[slug]`
