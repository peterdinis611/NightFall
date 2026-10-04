import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Sparkles, Headphones, BookMarked, Eye, Zap, Moon } from "lucide-react"

const FEATURES = [
  {
    roman: "I",
    icon: Sparkles,
    title: "AI-Generated Horror",
    desc: "Describe your fear — GPT-4o weaves it into a unique, atmospheric nightmare tailored to your prompt.",
  },
  {
    roman: "II",
    icon: Headphones,
    title: "Immersive Player",
    desc: "Eight mood-driven scene backgrounds, typewriter narration, and cross-faded audio pull you into the story.",
  },
  {
    roman: "III",
    icon: BookMarked,
    title: "Your Dark Library",
    desc: "Every story is saved. Re-read, share publicly, or delete the ones that disturbed you too much.",
  },
]

const STEPS = [
  { icon: Eye,  step: "01", title: "Describe",   desc: "Write what terrifies you" },
  { icon: Zap,  step: "02", title: "Generate",   desc: "AI summons your story" },
  { icon: Moon, step: "03", title: "Experience", desc: "Read in the dark" },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export function LandingFeatures() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="features" ref={ref} className="relative px-4 py-28 sm:py-36 overflow-hidden">
      {/* Background glyph */}
      <div
        className="absolute right-[-5%] top-[10%] font-serif text-[20rem] leading-none select-none pointer-events-none opacity-[0.015] dark:opacity-[0.025] text-blood-900"
        aria-hidden
      >
        ✦
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Asymmetric header */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 sm:mb-28 max-w-2xl"
        >
          <p className="editorial-label mb-5">How it works</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-medium text-fg leading-[1.08] tracking-tight">
            From fear to
            <br />
            <span className="text-gradient italic font-semibold pl-4 sm:pl-8">fiction</span>
          </h2>
          <div className="manuscript-rule mt-8 w-32 sm:w-48" />
        </motion.div>

        {/* Ritual steps — diagonal connector on desktop */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="relative mb-24 sm:mb-32"
        >
          {/* Connecting line */}
          <div
            className="hidden lg:block absolute top-1/2 left-[8%] right-[8%] h-px -translate-y-1/2 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,21,56,0.25) 15%, rgba(139,21,56,0.25) 85%, transparent)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                className={`relative flex sm:flex-col items-start sm:items-center gap-5 sm:text-center ${
                  i === 1 ? "sm:mt-6" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <motion.div
                    className="flex size-16 sm:size-[4.5rem] items-center justify-center border border-[var(--border)] bg-[var(--surface-bg)]"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    <step.icon className="size-6 text-blood-500 dark:text-blood-400" strokeWidth={1.5} />
                  </motion.div>
                  <span className="ritual-index absolute -top-3 -right-2 sm:-top-2 sm:left-1/2 sm:-translate-x-1/2 sm:-right-auto">
                    {step.step}
                  </span>
                </div>
                <div className="sm:mt-2">
                  <p className="font-serif text-xl font-semibold text-fg mb-1">{step.title}</p>
                  <p className="text-sm text-muted italic leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature cards — staggered editorial grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5"
        >
          {FEATURES.map((feat, i) => (
            <motion.article
              key={feat.title}
              variants={fadeUp}
              className={`manuscript-card p-7 sm:p-8 group cursor-default ${
                i === 1 ? "lg:mt-10" : i === 2 ? "lg:mt-4" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-serif text-3xl text-blood-500/25 dark:text-blood-400/30 font-light italic">
                  {feat.roman}
                </span>
                <div className="flex size-10 items-center justify-center border border-[var(--border)] group-hover:border-[var(--border-hover)] transition-colors">
                  <feat.icon className="size-4 text-blood-500 dark:text-blood-400" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-fg mb-3 leading-tight">
                {feat.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed font-serif">{feat.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
