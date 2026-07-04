import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { ConvexAuthProvider } from "@convex-dev/auth/react"
import { ConvexReactClient } from "convex/react"
import { router } from "./router"
import { ThemeProvider } from "~/lib/theme"
import { CONVEX_URL } from "~/lib/convex"
import { createAuthTokenStorage } from "~/db/authTokenStorage"
import "~/styles/globals.css"

const convex = new ConvexReactClient(CONVEX_URL)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ConvexAuthProvider
        client={convex}
        storage={createAuthTokenStorage()}
        storageNamespace={CONVEX_URL}
        replaceURL={(relativeUrl) => {
          const url = new URL(relativeUrl, window.location.origin)
          const search = Object.fromEntries(url.searchParams) as Record<string, string>
          if (url.pathname.startsWith("/story/")) {
            const slug = url.pathname.slice("/story/".length)
            void router.navigate({
              to: "/story/$slug",
              params: { slug },
              search,
              hash: url.hash,
              replace: true,
            })
            return
          }
          void router.navigate({
            to: url.pathname as "/" | "/auth" | "/library" | "/generate",
            search,
            hash: url.hash,
            replace: true,
          })
        }}
      >
        <RouterProvider router={router} />
      </ConvexAuthProvider>
    </ThemeProvider>
  </StrictMode>
)
