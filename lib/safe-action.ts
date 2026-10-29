import { createSafeActionClient, returnServerError } from "next-safe-action"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { CONVEX_URL } from "@/lib/convex"
import { unwrapConvexError } from "@/lib/errors"

/**
 * Base client — validation via Zod Standard Schema, server errors unwrapped for Convex.
 */
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    const message = unwrapConvexError(error)
    // Surface known app errors; hide opaque internals
    if (
      message.includes("Authentication required") ||
      message.includes("Unauthorized") ||
      message.includes("RATE_LIMIT|") ||
      message.includes("Prompt") ||
      message.includes("Missing") ||
      message.length < 160
    ) {
      return message
    }
    console.error("[safe-action]", message)
    return "Something went wrong"
  },
})

/** Requires Convex auth cookie + deployment URL */
export const authActionClient = actionClient.use(async ({ next }) => {
  if (!CONVEX_URL) {
    return returnServerError("Missing NEXT_PUBLIC_CONVEX_URL — set it in .env.local")
  }

  const token = await convexAuthNextjsToken()
  if (!token) {
    return returnServerError("Authentication required")
  }

  return next({ ctx: { token, convexUrl: CONVEX_URL } })
})
