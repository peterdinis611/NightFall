import { ConvexHttpClient } from "convex/browser"
import { storeAuthTokens, clearStoredAuthSession } from "~/db/authTokens"
import { CONVEX_URL } from "~/lib/convex"

type AuthActionResult = {
  tokens?: { token: string; refreshToken: string } | null
}

/**
 * Reliable guest session: call auth:signIn over HTTP, write namespaced
 * tokens ConvexAuthProvider expects, then hard-reload so the React client
 * picks them up (useAuthActions signIn can hang without flipping auth).
 */
export async function establishGuestSession(
  returnPath: string = "/#generate",
): Promise<void> {
  clearStoredAuthSession()

  const client = new ConvexHttpClient(CONVEX_URL)
  const result = (await client.action("auth:signIn" as never, {
    provider: "anonymous",
    params: {},
  })) as AuthActionResult

  if (!result.tokens?.token || !result.tokens.refreshToken) {
    throw new Error("Guest sign-in did not return a session.")
  }

  storeAuthTokens(result.tokens)

  const url = returnPath.startsWith("http")
    ? returnPath
    : `${window.location.origin}${returnPath.startsWith("/") ? returnPath : `/${returnPath}`}`

  window.location.assign(url)
}
