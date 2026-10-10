// @ts-nocheck
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import { Anonymous } from "@convex-dev/auth/providers/Anonymous"
import { Password } from "@convex-dev/auth/providers/Password"
import { query } from "./_generated/server"

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = String(params.email ?? "")
          .trim()
          .toLowerCase()
        if (!email) {
          throw new Error("Email is required")
        }
        return {
          email,
          ...(params.name ? { name: String(params.name).trim() } : {}),
        }
      },
    }),
    GitHub,
    Google,
    Anonymous({
      profile: () => ({
        name: "Guest",
        isAnonymous: true,
      }),
    }),
  ],
})

/**
 * Explicit public query for Next.js middleware (convex-auth ≥0.0.76).
 * Re-exporting from convexAuth() was not registering on the deployment.
 */
export const isAuthenticated = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    return userId !== null
  },
})
