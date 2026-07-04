import type { NavigateOptions } from "@tanstack/react-router"

const ALLOWED_REDIRECTS = new Set([
  "/",
  "/library",
  "/auth",
  "/generate",
])

/** Safe post-auth redirect — only allows known in-app paths. */
export function getAuthRedirectPath(redirect?: string): string {
  if (!redirect) return "/"
  if (ALLOWED_REDIRECTS.has(redirect)) return redirect
  if (redirect.startsWith("/story/")) return redirect
  return "/"
}

export function authNavigateOptions(path: string): NavigateOptions {
  if (path.startsWith("/story/")) {
    const slug = path.slice("/story/".length)
    return { to: "/story/$slug", params: { slug } }
  }
  if (path === "/library") return { to: "/library" }
  if (path === "/generate") return { to: "/generate" }
  if (path === "/auth") return { to: "/auth" }
  return { to: "/" }
}
