import { useRef } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { ThemeAmbient } from "~/components/layout/ThemeAmbient"
import { BloodDrip } from "~/components/landing/HorrorEffects"
import { Marginalia } from "~/components/landing/Marginalia"
import { PromptForm } from "~/components/prompt/PromptForm"
import { AppBrand, AppTagline } from "~/components/shared/AppBrand"
import { LandingHero } from "~/components/landing/LandingHero"
import { LandingFeatures } from "~/components/landing/LandingFeatures"
import { LandingMarquee, LandingCTA } from "~/components/landing/LandingMarquee"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const formRef = useRef<HTMLElement>(null)

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="relative dark:bg-[var(--background)]">
      <div className="ambient-layer" aria-hidden>
        <ThemeAmbient />
      </div>
      <BloodDrip />
      <Marginalia />

      <div className="relative z-10">
        <LandingHero onScrollToForm={scrollToForm} />

        <LandingMarquee />

        <LandingFeatures />

        <section
          id="generate"
          ref={formRef}
          className="relative px-5 py-28 sm:py-36 scroll-mt-24"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 50% 10%, color-mix(in srgb, var(--blood) 12%, transparent) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-2xl mx-auto relative">
            <LandingCTA />

            <motion.div
              className="manuscript-card p-6 sm:p-10 relative"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-marginalia text-[11px] text-[var(--verdigris)] mb-6">
                write in the blank
              </p>

              <div className="relative">
                <PromptForm />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="mt-10 text-center text-xs text-muted leading-relaxed font-sans italic"
            >
              AI horror · 16+ · Stories may unsettle ·{" "}
              <span className="not-italic font-mono text-[10px] tracking-wider text-[var(--verdigris)]">
                Saved to your library
              </span>
            </motion.p>
          </div>
        </section>

        <footer className="relative px-5 py-12 border-t border-[var(--border)] overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative">
            <p className="font-serif text-sm text-muted italic">
              <AppBrand /> — <AppTagline />
            </p>
            <p className="font-marginalia text-[10px] text-[var(--verdigris)] tracking-wide">
              enter at your own risk
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
