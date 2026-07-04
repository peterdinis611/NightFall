export type AuthMode = "signIn" | "signUp"

export function formatAuthError(err: unknown, mode: AuthMode): string {
  const raw = err instanceof Error ? err.message : "Authentication failed"
  const code = raw.includes("[CONVEX")
    ? raw.match(/Uncaught Error: ([^\n]+)/)?.[1] ?? raw
    : raw

  if (code.includes("JWT_PRIVATE_KEY")) {
    return "Auth is not configured yet. Run: npm run auth:setup"
  }
  if (code === "InvalidAccountId") {
    return mode === "signIn"
      ? "No account found for this email. Create an account first."
      : "Could not create account. Try a different email."
  }
  if (code === "InvalidSecret") {
    return "Incorrect password."
  }
  if (code.includes("already exists")) {
    return "An account with this email already exists. Sign in instead."
  }
  if (code === "Invalid password") {
    return "Password must be at least 8 characters."
  }

  return code.length > 180 ? `${code.slice(0, 180)}…` : code
}
