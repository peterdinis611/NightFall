import { motion } from "framer-motion"

const QUOTES = [
  "It whispered my name before I finished the prompt.",
  "I closed the tab. The story kept going in my head.",
  "The mirror scene — I left the lights on.",
  "One sentence in. I should have stopped there.",
  "My library looks like a confession booth.",
  "I wrote about the attic. Something wrote back.",
  "It knew details I never typed.",
  "I read it twice. The second time, it was different.",
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
        className={`flex w-max gap-16 sm:gap-24 whitespace-nowrap ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } motion-reduce:animate-none`}
        style={{ willChange: "transform" }}
      >
        {doubled.map((quote, i) => (
          <span
            key={i}
            className="font-serif text-[1.05rem] sm:text-lg italic text-muted"
          >
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
    <div className="relative overflow-hidden border-y border-[var(--border)] whisper-band">
      <div className="relative py-8 sm:py-11">
        <div className="flex items-center justify-center gap-5 mb-6 px-4">
          <div className="h-px flex-1 max-w-[80px] bg-[var(--border-hover)]" />
          <p className="font-sans text-xs text-muted tracking-wide">
            Things people wrote and then reread
          </p>
          <div className="h-px flex-1 max-w-[80px] bg-[var(--border-hover)]" />
        </div>

        <div
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--background), color-mix(in srgb, var(--background) 40%, transparent), transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, var(--background), color-mix(in srgb, var(--background) 40%, transparent), transparent)",
          }}
        />

        <TickerRow quotes={rowA} />
        <TickerRow quotes={rowB} reverse />
      </div>
    </div>
  )
}

export function LandingCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 relative text-left sm:text-center"
    >
      <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-normal text-fg leading-[1.08] tracking-tight">
        Speak your fear into the page
      </h2>
      <p className="mt-4 text-muted text-base max-w-md sm:mx-auto leading-relaxed font-sans">
        One prompt. A story that does not want to let you go.
      </p>
    </motion.div>
  )
}
