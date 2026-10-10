"use client"

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs"
import { ConvexReactClient } from "convex/react"
import { ThemeProvider } from "@/lib/theme"
import { AmbientSoundProvider } from "@/lib/ambientSound"
import { CONVEX_URL } from "@/lib/convex"

const convex = new ConvexReactClient(CONVEX_URL)

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <ThemeProvider>
        <AmbientSoundProvider>{children}</AmbientSoundProvider>
      </ThemeProvider>
    </ConvexAuthNextjsProvider>
  )
}
