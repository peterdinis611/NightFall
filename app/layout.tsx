import type { Metadata } from "next"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ConvexClientProvider } from "./ConvexClientProvider"
import { ScrollBackdrop } from "@/components/layout/ScrollBackdrop"
import { AppNav } from "@/components/layout/AppNav"
import { ContentWarning } from "@/components/shared/ContentWarning"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nightfall — AI Horror Story Generator",
  description: "Summon cinematic horror stories with AI.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IM+Fell+English:ital@0;1&family=IBM+Plex+Mono:wght@400;500&family=Special+Elite&display=swap"
            rel="stylesheet"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var s=localStorage.getItem("nightfall-theme");var d=s!=="light";document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`,
            }}
          />
        </head>
        <body className="min-h-screen antialiased">
          <ConvexClientProvider>
            <ScrollBackdrop />
            <div className="relative z-10 min-h-screen text-fg">
              <AppNav />
              <ContentWarning />
              {children}
            </div>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
