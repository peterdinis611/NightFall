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
    <main className="relative min-h-screen flex flex-col items-center justify-center px-5 py-24 pt-28">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl text-fg mb-3 leading-tight">
            Sign in
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-[32ch]">
            So the stories stay on your shelf. Nothing more.
          </p>
        </div>

        <div className="border-t border-[var(--border)] pt-8">
          <AuthForm redirectTo={redirectTo} />
        </div>

        <Link
          href="/"
          className="mt-10 flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
      </div>
    </main>
  )
}
