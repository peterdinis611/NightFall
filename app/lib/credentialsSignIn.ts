import { ConvexHttpClient } from "convex/browser"
import {
  clearStoredAuthSession,
  redirectAfterAuth,
  storeAuthTokens,
} from "~/db/authTokens"
import { CONVEX_URL } from "./convex"

type AuthActionResult = {
  tokens?: { token: string; refreshToken: string } | null
  redirect?: string
  started?: boolean
}

export async function callAuthSignIn(
  provider: string,
  params: Record<string, string>,
  client: ConvexHttpClient = new ConvexHttpClient(CONVEX_URL),
): Promise<AuthActionResult> {
  clearStoredAuthSession()
  return client.action("auth:signIn" as never, { provider, params })
}

export async function passwordSignIn(
  args: {
    email: string
    password: string
    flow: "signIn" | "signUp"
    name?: string
  },
  destination: string,
  client?: ConvexHttpClient,
): Promise<void> {
  const result = await callAuthSignIn(
    "password",
    {
      email: args.email.trim().toLowerCase(),
      password: args.password,
      flow: args.flow,
      ...(args.name?.trim() ? { name: args.name.trim() } : {}),
    },
    client,
  )

  if (result.redirect) {
    window.location.href = result.redirect
    return
  }

  if (result.tokens?.token && result.tokens.refreshToken) {
    storeAuthTokens(result.tokens)
    redirectAfterAuth(destination)
    return
  }

  throw new Error("Sign-in did not return a session. Please try again.")
}

export async function anonymousSignIn(
  destination: string,
  client?: ConvexHttpClient,
): Promise<void> {
  const result = await callAuthSignIn("anonymous", {}, client)

  if (result.tokens?.token && result.tokens.refreshToken) {
    storeAuthTokens(result.tokens)
    redirectAfterAuth(destination)
    return
  }

  throw new Error("Guest sign-in did not return a session.")
}
