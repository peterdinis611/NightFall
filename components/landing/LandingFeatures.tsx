const STEPS = [
  {
    title: "Confess",
    desc: "Type the fear you would not say to anyone in the room.",
  },
  {
    title: "Wait",
    desc: "The page fills itself. Do not refresh. Do not look away yet.",
  },
  {
    title: "Read",
    desc: "When it is ready, the silence after the last line is part of the story.",
  },
]

/** Bare sequence — no icons, no cards, no decorative numerals. */
export function LandingFeatures() {
  return (
    <section id="features" className="relative px-5 py-24 sm:py-32 border-t border-[var(--border)]">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-fg leading-tight mb-14 max-w-[14ch]">
          How it gets under your skin
        </h2>

        <ol className="space-y-0">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[3rem_1fr] gap-4 sm:gap-8 py-8 border-t border-[var(--border)] last:border-b"
            >
              <span className="font-serif text-fg/35 text-lg pt-0.5">
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-fg mb-2">{step.title}</h3>
                <p className="text-[0.95rem] text-muted leading-relaxed max-w-md">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
