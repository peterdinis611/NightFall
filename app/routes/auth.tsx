import { createFileRoute, Link } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { AuthForm } from "~/components/auth/AuthForm"
import { ArrowLeft } from "lucide-react"

type AuthSearch = {
  redirect?: string
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: AuthPage,
})

function AuthPage() {
  const { redirect } = Route.useSearch()
  const redirectTo = redirect ?? "/"

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 pt-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 20%, var(--accent-glow) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 80% 80%, var(--primary-glow) 0%, transparent 50%)",
        }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <p className="label-section !mb-3" style={{ color: "var(--accent)" }}>
            Account
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-fg mb-2 horror-title">
            Enter the <span className="horror-word italic">darkness</span>
          </h1>
          <p className="text-muted text-sm">
            Sign in to generate and save your horror stories
          </p>
        </div>

        <div className="auth-card p-6 sm:p-7">
          <div className="relative z-[1]">
            <AuthForm redirectTo={redirectTo} />
          </div>
        </div>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to home
        </Link>
      </motion.div>
    </main>
  )
}
