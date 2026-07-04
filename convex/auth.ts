// @ts-nocheck
import { convexAuth } from "@convex-dev/auth/server"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import { Anonymous } from "@convex-dev/auth/providers/Anonymous"
import { Password } from "@convex-dev/auth/providers/Password"

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
