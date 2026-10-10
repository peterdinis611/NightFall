import Link from "next/link"
import { AuthForm } from "@/components/auth/AuthForm"
import { ArrowLeft } from "lucide-react"

type Props = {
  searchParams: Promise<{ redirect?: string }>
}

export default async function AuthPage({ searchParams }: Props) {
  const params = await searchParams
  const redirectTo = params.redirect ?? "/"

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

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <p className="label-section !mb-3" style={{ color: "var(--accent)" }}>
            Account
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-fg mb-2 horror-title">
            Enter the <span className="horror-word italic">darkness</span>
          </h1>
          <p className="text-muted text-sm">Sign in to generate and save your horror stories</p>
        </div>

        <div className="auth-card p-6 sm:p-7">
          <div className="relative z-[1]">
            <AuthForm redirectTo={redirectTo} />
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to home
        </Link>
      </div>
    </main>
  )
}
