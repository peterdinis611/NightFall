import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="font-marginalia text-[11px] text-[var(--verdigris)] mb-4">fol. 404</p>
      <h1 className="font-serif text-4xl text-fg mb-3">Lost in the dark</h1>
      <p className="text-muted text-sm mb-8 max-w-sm">
        This page was never written — or something tore it out.
      </p>
      <Link href="/" className="btn-primary !py-2.5 !px-5 !text-sm">
        Return home
      </Link>
    </main>
  )
}
