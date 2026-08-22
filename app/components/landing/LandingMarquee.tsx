import { motion } from "framer-motion"

const QUOTES = [
  "It knew my name before I typed it.",
  "I couldn't stop reading until 3 AM.",
  "The scene with the mirror — I had to pause.",
  "Generated from one sentence. One sentence.",
  "My library is a graveyard of bad decisions.",
  "The fog animation actually made me uneasy.",
  "I wrote 'something in the attic' and regretted everything.",
  "Better than most horror anthologies I've read.",
]

function TickerRow({
  quotes,
  reverse = false,
}: {
  quotes: string[]
  reverse?: boolean
}) {
  const doubled = [...quotes, ...quotes]

  return (
    <div className="overflow-hidden py-3">
      <div
        className={`flex w-max gap-12 whitespace-nowrap ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } motion-reduce:animate-none`}
        style={{ willChange: "transform" }}
      >
        {doubled.map((quote, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 font-serif text-base sm:text-lg italic text-[var(--bone,#6b6360)]/80 dark:text-[#c4bab0]/75"
          >
            <span className="ritual-index shrink-0">
              {String((i % quotes.length) + 1).padStart(2, "0")}
            </span>
            <span className="text-blood-600/40 dark:text-blood-700/50 shrink-0 font-mono not-italic text-xs">
              ✦
            </span>
            &ldquo;{quote}&rdquo;
          </span>
        ))}
      </div>
    </div>
  )
}

export function LandingMarquee() {
  const rowA = QUOTES.slice(0, 4)
  const rowB = QUOTES.slice(4)

  return (
    <div className="relative overflow-hidden dark:bg-[#080609] bg-[var(--surface-bg)]">
      <div className="manuscript-rule" />

      <div className="relative py-6 sm:py-8">
        <div className="flex items-center justify-center gap-4 mb-6 px-4">
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-blood-800/30" />
          <p className="editorial-label text-center">Whispers from the void</p>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-blood-800/30" />
        </div>

        <div
          className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
        />

        <TickerRow quotes={rowA} />
        <TickerRow quotes={rowB} reverse />
      </div>

      <div className="manuscript-rule" />
    </div>
  )
}

export function LandingCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 text-left sm:text-center"
    >
      <p className="editorial-label mb-4">Ready?</p>
      <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-fg leading-[1.05] tracking-tight">
        Write your
        <br className="sm:hidden" />
        {" "}
        <span className="text-gradient italic font-semibold">nightmare</span>
      </h2>
      <p className="mt-4 text-muted text-sm sm:text-base max-w-md sm:mx-auto leading-relaxed font-serif italic">
        One prompt. A full horror story — scenes, moods, and narration.
      </p>
      <div className="manuscript-rule mt-8 max-w-xs sm:mx-auto" />
    </motion.div>
  )
}
