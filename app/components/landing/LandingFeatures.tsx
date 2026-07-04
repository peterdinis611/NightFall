import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Sparkles, Headphones, BookMarked, Eye, Zap, Moon } from "lucide-react"

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Generated Horror",
    desc: "Describe your fear — GPT-4o weaves it into a unique, atmospheric nightmare tailored to your prompt.",
    color: "text-blood-400",
    glow: "rgba(220,38,38,0.08)",
  },
  {
    icon: Headphones,
    title: "Immersive Player",
    desc: "Eight mood-driven scene backgrounds, typewriter narration, and cross-faded audio pull you into the story.",
    color: "text-violet-400",
    glow: "rgba(139,92,246,0.08)",
  },
  {
    icon: BookMarked,
    title: "Your Dark Library",
    desc: "Every story is saved. Re-read, share publicly, or delete the ones that disturbed you too much.",
    color: "text-ember-400",
    glow: "rgba(249,115,22,0.08)",
  },
]

const STEPS = [
  { icon: Eye,  step: "01", title: "Describe",  desc: "Write what terrifies you" },
  { icon: Zap,  step: "02", title: "Generate",  desc: "AI summons your story" },
  { icon: Moon, step: "03", title: "Experience", desc: "Read in the dark" },
]

export function LandingFeatures() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="features" ref={ref} className="relative px-4 py-24 sm:py-32">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="label-section !text-violet-400/60">How it works</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-fg mt-2">
            From fear to <span className="text-gradient italic">fiction</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4 mb-20">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.15 }}
              className="flex items-center gap-4 sm:flex-col sm:text-center"
            >
              <div className="relative">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-bg)]">
                  <step.icon className="size-6 text-muted" />
                </div>
                <span className="absolute -top-2 -right-2 font-mono text-[9px] text-blood-500/70">
                  {step.step}
                </span>
              </div>
              <div className="sm:mt-3">
                <p className="font-semibold text-sm text-fg">{step.title}</p>
                <p className="text-xs text-muted">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block w-12 h-px bg-gradient-to-r from-white/10 to-transparent mx-2" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="surface p-6 group cursor-default"
              style={{ boxShadow: `0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 40px ${feat.glow}` }}
            >
              <div className={`mb-4 flex size-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-bg)] ${feat.color} group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon className="size-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-fg mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
