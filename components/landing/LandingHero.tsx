"use client"

import { useTheme } from "@/lib/theme"
import { HeroAtmosphere } from "@/components/landing/HeroAtmosphere"

type LandingHeroProps = {
  onScrollToForm: () => void
}

/**
 * Dark: sealed cellar. Light: overcast corridor (lightFall).
 */
export function LandingHero({ onScrollToForm }: LandingHeroProps) {
  const { theme, appName } = useTheme()
  const dark = theme === "dark"

  return (
    <section className="cellar-hero relative min-h-[100svh] flex flex-col justify-end px-5 pt-32 pb-16 sm:pb-20 overflow-hidden">
      <HeroAtmosphere dark={dark} />

      <div
        className={`pointer-events-none absolute inset-0 z-[3] ${dark ? "film-grain" : "paper-grain"}`}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <h1 className="stamp-title relative mb-12 sm:mb-16 select-none">
          <span className="stamp-title-ink" aria-hidden>
            {appName}
          </span>
          <span className="stamp-title-face">{appName}</span>
          <span className="ink-weep" aria-hidden />
        </h1>

        <div className="max-w-md space-y-8">
          <p className="font-serif text-[1.5rem] sm:text-[1.85rem] leading-[1.2] text-fg/90">
            {dark
              ? "Name the thing that waits when the lights go out."
              : "Name what the daylight refuses to show."}
          </p>
          <p className="text-[0.95rem] leading-relaxed text-muted max-w-[32ch]">
            {dark
              ? "Nightfall writes it back as a story. You may not want the last page."
              : "lightFall writes it back as a story. The page stays bright. The words do not."}
          </p>

          <button type="button" onClick={onScrollToForm} className="btn-clot">
            Begin
          </button>
        </div>
      </div>
    </section>
  )
}
