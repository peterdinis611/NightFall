import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { ConvexAuthProvider } from "@convex-dev/auth/react"
import { ConvexReactClient } from "convex/react"
import { router } from "./router"
import { ThemeProvider } from "~/lib/theme"
import "~/styles/globals.css"

const convexUrl = import.meta.env.VITE_CONVEX_URL as string
if (!convexUrl) {
  throw new Error("Missing VITE_CONVEX_URL — run `npx convex dev` first.")
}

const convex = new ConvexReactClient(convexUrl)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ConvexAuthProvider
        client={convex}
        replaceURL={(relativeUrl) => {
          const url = new URL(relativeUrl, window.location.origin)
          router.navigate({
            to: url.pathname as "/",
            search: Object.fromEntries(url.searchParams) as Record<string, string>,
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
