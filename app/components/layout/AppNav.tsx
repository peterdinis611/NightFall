import { Link } from "@tanstack/react-router"
import { useConvexAuth, useQuery } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { api } from "@convex/_generated/api"
import {
  Ghost,
  BookOpen,
  LogIn,
  LogOut,
  Sun,
  ChevronDown,
  User,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "~/components/shared/ThemeToggle"
import { AmbientSoundToggle } from "~/components/shared/AmbientSoundToggle"
import { AppBrand } from "~/components/shared/AppBrand"
import { useTheme } from "~/lib/theme"
import { cn } from "~/lib/utils"

export function AppNav() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { theme } = useTheme()
  const { signOut } = useAuthActions()

  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip")

  const profileLabel =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    (user?.isAnonymous ? "Guest" : "Account")

  const profileInitial = (profileLabel[0] ?? user?.email?.[0] ?? "?").toUpperCase()

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] nav-glass">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-25" />

      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link
          to="/"
          className="group flex items-center gap-3 font-serif font-semibold tracking-wide transition-colors"
        >
          <motion.span
            className="relative flex size-9 items-center justify-center rounded-sm border bg-[var(--surface-bg)]"
            style={{ borderColor: "var(--border)" }}
            whileHover={{ scale: 1.04 }}
            animate={{
              boxShadow: [
                "0 0 0 0 transparent",
                "0 0 0 4px color-mix(in srgb, var(--verdigris) 18%, transparent)",
                "0 0 0 0 transparent",
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            {theme === "light" ? (
              <Sun className="size-4" style={{ color: "var(--blood)" }} />
            ) : (
              <Ghost className="size-4" style={{ color: "var(--verdigris)" }} />
            )}
          </motion.span>
          <AppBrand split className="text-fg group-hover:opacity-80 transition-opacity text-lg" />
        </Link>

        <div className="flex items-center gap-2">
          <AmbientSoundToggle />
          <ThemeToggle />

          {isLoading && !isAuthenticated ? (
            <div className="h-9 w-28 rounded-xl bg-[var(--surface-bg)] animate-pulse" />
          ) : isAuthenticated ? (
            <ProfileDropdown
              label={profileLabel}
              initial={profileInitial}
              email={user?.email}
              isAnonymous={user?.isAnonymous ?? false}
              loading={user === undefined}
              onSignOut={() => void signOut()}
            />
          ) : (
            <Link
              to="/auth"
              search={{ redirect: undefined }}
              className="flex items-center gap-1.5 rounded-sm border px-3.5 py-2 text-xs font-medium transition-all"
              style={{
                borderColor: "color-mix(in srgb, var(--blood) 35%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--blood) 8%, transparent)",
                color: "var(--blood)",
              }}
            >
              <LogIn className="size-3.5" />
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

function ProfileDropdown({
  label,
  initial,
  email,
  isAnonymous,
  loading,
  onSignOut,
}: {
  label: string
  initial: string
  email?: string | null
  isAnonymous: boolean
  loading?: boolean
  onSignOut: () => void
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors",
            "hover:border-[var(--border-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
          )}
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface-bg)",
            color: "var(--foreground)",
          }}
          aria-label="Open profile menu"
        >
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
            style={{
              backgroundColor: "rgba(159,18,57,0.12)",
              color: "var(--primary)",
            }}
          >
            {loading ? "…" : initial}
          </span>
          <span className="max-w-[7rem] truncate hidden sm:inline">{label}</span>
          <ChevronDown className="size-3.5 opacity-60" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-[200] min-w-[14rem] rounded-xl border p-1.5 shadow-card",
            "bg-[var(--card)] border-[var(--border)]"
          )}
        >
          <div className="px-3 py-2.5 border-b border-[var(--border)] mb-1">
            <p className="text-sm font-medium text-fg truncate">{label}</p>
            {email && (
              <p className="text-[11px] text-muted truncate mt-0.5">{email}</p>
            )}
            {isAnonymous && (
              <p className="text-[10px] text-muted mt-1.5 uppercase tracking-wider">
                Guest session
              </p>
            )}
          </div>

          <DropdownMenu.Item asChild>
            <Link
              to="/library"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg outline-none cursor-pointer hover:bg-[var(--card-hover)]"
            >
              <BookOpen className="size-4 text-muted" />
              My library
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              to="/"
              hash="generate"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg outline-none cursor-pointer hover:bg-[var(--card-hover)]"
            >
              <Sparkles className="size-4 text-muted" />
              New story
            </Link>
          </DropdownMenu.Item>

          {isAnonymous && (
            <DropdownMenu.Item asChild>
              <Link
                to="/auth"
                search={{ redirect: "/" }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg outline-none cursor-pointer hover:bg-[var(--card-hover)]"
              >
                <User className="size-4 text-muted" />
                Create account
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Separator className="my-1 h-px bg-[var(--border)]" />

          <DropdownMenu.Item
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg outline-none cursor-pointer hover:bg-[var(--card-hover)]"
            onSelect={onSignOut}
          >
            <LogOut className="size-4 text-muted" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
