const ALLOWED_REDIRECTS = new Set(["/", "/library", "/auth", "/generate"])

/** Safe post-auth redirect — only allows known in-app paths. */
export function getAuthRedirectPath(redirect?: string | null): string {
  if (!redirect) return "/"
  if (ALLOWED_REDIRECTS.has(redirect)) return redirect
  if (redirect.startsWith("/story/")) return redirect
  return "/"
}
