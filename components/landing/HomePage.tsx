"use client"

import { useEffect, useRef } from "react"
import { PromptForm } from "@/components/prompt/PromptForm"
import { AppBrand } from "@/components/shared/AppBrand"
import { LandingHero } from "@/components/landing/LandingHero"
import { LandingFeatures } from "@/components/landing/LandingFeatures"
import Link from "next/link"

export function HomePage() {
  const formRef = useRef<HTMLElement>(null)

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    if (window.location.hash !== "#generate") return
    const id = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "instant", block: "start" })
    }, 50)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="relative bg-[var(--background)]">
      <LandingHero onScrollToForm={scrollToForm} />

      <LandingFeatures />

      <section
        id="generate"
        ref={formRef}
        className="relative px-5 py-24 sm:py-32 scroll-mt-20 border-t border-[var(--border)]"
      >
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-fg leading-tight mb-3">
            The blank page
          </h2>
          <p className="text-muted text-[0.95rem] mb-10 max-w-[36ch] leading-relaxed">
            Whatever you write here becomes material. Choose carefully.
          </p>

          <div className="border-t-2 border-[var(--blood)]/50 pt-8">
            <PromptForm />
          </div>

          <p className="mt-10 text-xs text-muted leading-relaxed">
            Ages 16 and up. Stories can disturb. Saved only to your library.
          </p>
        </div>
      </section>

      <footer className="px-5 py-10 border-t border-[var(--border)]">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-serif text-sm text-muted">
            <AppBrand />
          </p>
          <Link
            href="/library"
            className="text-xs text-muted hover:text-fg transition-colors underline-offset-4 hover:underline"
          >
            Leave to library
          </Link>
        </div>
      </footer>
    </div>
  )
}
