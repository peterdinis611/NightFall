"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useConvexAuth, useQuery } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { api } from "@convex/_generated/api"
import { BookOpen, LogIn, LogOut, ChevronDown, User } from "lucide-react"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { AmbientSoundToggle } from "@/components/shared/AmbientSoundToggle"
import { AppBrand } from "@/components/shared/AppBrand"
import { useAccountClaim } from "@/lib/useAccountClaim"
import { cn } from "@/lib/utils"

export function AppNav() {
  const pathname = usePathname() ?? "/"
  const reading = pathname.startsWith("/story/")
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()

  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip")

  const profileLabel =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    (user?.isAnonymous ? "Guest" : "Account")

  const profileInitial = (profileLabel[0] ?? user?.email?.[0] ?? "?").toUpperCase()

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100]",
        reading ? "bg-transparent" : "nav-glass",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-5xl items-center justify-between px-5",
          reading ? "py-3" : "py-3.5",
        )}
      >
        <div className="flex items-center gap-5 min-w-0">
          <Link
            href="/"
            className={cn(
              "font-serif tracking-tight text-fg hover:opacity-70 transition-opacity shrink-0",
              reading ? "text-base opacity-75" : "text-xl",
            )}
          >
            <AppBrand />
          </Link>
          {!reading && (
            <Link
              href="/explore"
              className={cn(
                "hidden sm:inline text-xs tracking-wide transition-colors",
                pathname.startsWith("/explore")
                  ? "text-fg"
                  : "text-muted hover:text-fg",
              )}
            >
              Explore
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!reading && <AmbientSoundToggle />}
          <ThemeToggle />

          {isLoading && !isAuthenticated ? (
            <div className="h-9 w-24 bg-[var(--surface-bg)] animate-pulse" />
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
              href="/auth"
              className="inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-xs text-muted hover:text-fg hover:border-[var(--border-hover)] transition-colors"
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
  const { prepareClaim } = useAccountClaim()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 border px-2.5 py-1.5 text-xs transition-colors",
            "hover:border-[var(--border-hover)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--blood)]/40",
          )}
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface-bg)",
            color: "var(--foreground)",
          }}
          aria-label="Open profile menu"
        >
          <span
            className="flex size-6 shrink-0 items-center justify-center text-[10px] font-medium"
            style={{
              backgroundColor: "rgba(122,34,36,0.15)",
              color: "var(--blood)",
            }}
          >
            {loading ? "…" : initial}
          </span>
          <span className="max-w-[7rem] truncate hidden sm:inline">{label}</span>
          <ChevronDown className="size-3.5 opacity-50" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[200] min-w-[13rem] border border-[var(--border)] bg-[var(--card)] p-1 shadow-card"
        >
          <div className="px-3 py-2.5 border-b border-[var(--border)] mb-1">
            <p className="text-sm text-fg truncate">{label}</p>
            {email && <p className="text-[11px] text-muted truncate mt-0.5">{email}</p>}
            {isAnonymous && (
              <p className="text-[10px] text-muted mt-1.5">Guest session</p>
            )}
          </div>

          <DropdownMenu.Item asChild>
            <Link
              href="/library"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-fg outline-none cursor-pointer hover:bg-[var(--card-hover)]"
            >
              <BookOpen className="size-4 text-muted" />
              Library
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/explore"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-fg outline-none cursor-pointer hover:bg-[var(--card-hover)]"
            >
              Explore
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/#generate"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-fg outline-none cursor-pointer hover:bg-[var(--card-hover)]"
            >
              New story
            </Link>
          </DropdownMenu.Item>

          {isAnonymous && (
            <DropdownMenu.Item asChild>
              <Link
                href="/auth?redirect=/library"
                onClick={() => void prepareClaim()}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-fg outline-none cursor-pointer hover:bg-[var(--card-hover)]"
              >
                <User className="size-4 text-muted" />
                Create account
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Separator className="my-1 h-px bg-[var(--border)]" />

          <DropdownMenu.Item
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-fg outline-none cursor-pointer hover:bg-[var(--card-hover)]"
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
