import { Link } from "@tanstack/react-router"
import { useConvexAuth } from "convex/react"
import { useQuery } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { api } from "@convex/_generated/api"
import { Ghost, BookOpen, LogIn, LogOut, User, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "~/components/shared/ThemeToggle"
import { AppBrand } from "~/components/shared/AppBrand"
import { useTheme } from "~/lib/theme"

export function AppNav() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { theme } = useTheme()
  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip")
  const { signOut } = useAuthActions()

  const displayName =
    user?.name ?? user?.email?.split("@")[0] ?? (user?.isAnonymous ? "Guest" : null)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-glass">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-25" />

      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link
          to="/"
          className="group flex items-center gap-3 font-serif font-semibold tracking-wide transition-colors"
        >
          <motion.span
            className="relative flex size-9 items-center justify-center rounded-lg border bg-[var(--surface-bg)]"
            style={{ borderColor: "var(--border)" }}
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: theme === "light"
                ? [
                    "0 0 0 0 rgba(159,18,57,0)",
                    "0 0 0 4px rgba(159,18,57,0.08)",
                    "0 0 0 0 rgba(159,18,57,0)",
                  ]
                : [
                    "0 0 0 0 rgba(196,30,58,0)",
                    "0 0 0 4px rgba(196,30,58,0.1)",
                    "0 0 0 0 rgba(196,30,58,0)",
                  ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {theme === "light" ? (
              <Sun className="size-4" style={{ color: "#9f1239" }} />
            ) : (
              <Ghost className="size-4" style={{ color: "#e8a0a8" }} />
            )}
          </motion.span>
          <AppBrand split className="text-fg group-hover:opacity-80 transition-opacity text-lg" />
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated && (
            <Link
              to="/library"
              className="btn-ghost flex items-center gap-1.5 !py-2 !px-3 !text-xs"
            >
              <BookOpen className="size-3.5" />
              <span className="hidden sm:inline">Library</span>
            </Link>
          )}

          {isLoading ? (
            <div className="h-8 w-20 rounded-xl bg-[var(--surface-bg)] animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              {displayName && (
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted px-2">
                  <User className="size-3 text-violet-500 dark:text-violet-400/70" />
                  {displayName}
                </span>
              )}
              <button
                onClick={() => signOut()}
                className="btn-ghost flex items-center gap-1.5 !py-2 !px-3 !text-xs"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              search={{ redirect: undefined }}
              className="flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all"
              style={{
                borderColor: "rgba(159,18,57,0.2)",
                backgroundColor: theme === "light" ? "rgba(159,18,57,0.06)" : "rgba(196,30,58,0.1)",
                color: theme === "light" ? "#9f1239" : "#e8a0a8",
              }}
            >
              <LogIn className="size-3.5" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
