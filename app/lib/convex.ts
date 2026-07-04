export const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string

if (!CONVEX_URL) {
  throw new Error("Missing VITE_CONVEX_URL — run `npx convex dev` first.")
}
