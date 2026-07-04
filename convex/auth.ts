// @ts-nocheck
import { convexAuth } from "@convex-dev/auth/server"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import { Anonymous } from "@convex-dev/auth/providers/Anonymous"
import Password from "@convex-dev/auth/providers/Password"

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          ...(params.name ? { name: params.name as string } : {}),
        }
      },
    }),
    GitHub,
    Google,
    Anonymous,
  ],
})
