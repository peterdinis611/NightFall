"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="font-marginalia text-[11px] text-[var(--verdigris)] mb-4">fol. err</p>
      <h1 className="font-serif text-3xl text-fg mb-3">Something tore the page</h1>
      <p className="text-muted text-sm mb-6 max-w-md">
        {error.message || "An unexpected error occurred."}
      </p>
      <button type="button" onClick={reset} className="btn-primary !py-2.5 !px-5 !text-sm">
        Try again
      </button>
    </main>
  )
}
