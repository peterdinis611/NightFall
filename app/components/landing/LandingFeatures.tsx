import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Eye, Feather, Moon } from "lucide-react"

const STEPS = [
  {
    folio: "ii",
    icon: Eye,
    title: "Confess",
    desc: "Write the thing you avoid saying out loud.",
  },
  {
    folio: "iii",
    icon: Feather,
    title: "Inscribe",
    desc: "The model presses your fear into scenes and silence.",
  },
  {
    folio: "iv",
    icon: Moon,
    title: "Endure",
    desc: "Read until the room feels thinner than before.",
  },
]

const FEATURES = [
  {
    mark: "I",
    title: "Summoned by prompt",
    desc: "Name what scares you. GPT-4o builds a story that circles it until looking away costs more.",
  },
  {
    mark: "II",
    title: "Atmosphere that sticks",
    desc: "Mood, pacing, and low ambient sound — designed so the silence after reading still feels wrong.",
  },
  {
    mark: "III",
    title: "A private graveyard",
    desc: "Stories remain in your library. Revisit them, share the ones that haunt you, bury the rest.",
  },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export function LandingFeatures() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="features" ref={ref} className="relative px-5 py-28 sm:py-36 overflow-hidden">
      <div
        className="absolute left-[-4%] bottom-[8%] font-serif text-[18rem] leading-none select-none pointer-events-none opacity-[0.03] dark:opacity-[0.045] text-[var(--blood)]"
        aria-hidden
      >
        &
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 sm:mb-28 max-w-xl"
        >
          <p className="font-marginalia text-[11px] text-[var(--verdigris)] mb-4">
            fol. ii · the ritual
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-fg leading-[1.08] tracking-tight">
            From dread to
            <br />
            <span className="text-gradient italic pl-6 sm:pl-12">something worse</span>
          </h2>
          <div className="manuscript-rule mt-8 w-40" />
        </motion.div>

        {/* Asymmetric ritual steps — not a card grid */}
        <motion.ol
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="relative mb-28 space-y-0"
        >
          {STEPS.map((step, i) => (
            <motion.li
              key={step.folio}
              variants={fadeUp}
              className={`relative flex gap-6 sm:gap-10 py-8 border-t border-[var(--border)] ${
                i === STEPS.length - 1 ? "border-b" : ""
              } ${i % 2 === 1 ? "sm:pl-16 lg:pl-28" : ""}`}
            >
              <span className="font-marginalia text-sm text-[var(--verdigris)] shrink-0 pt-1 w-10">
                {step.folio}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className="size-4 text-[var(--blood)] opacity-70" strokeWidth={1.25} />
                  <h3 className="font-serif text-2xl sm:text-3xl text-fg">{step.title}</h3>
                </div>
                <p className="font-sans text-muted text-base leading-relaxed max-w-md italic">
                  {step.desc}
                </p>
              </div>
              <span
                className="hidden sm:block font-serif text-5xl text-[var(--blood)] opacity-[0.12] leading-none select-none"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.li>
          ))}
        </motion.ol>

        {/* Features as manuscript columns — staggered, not equal cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6"
        >
          {FEATURES.map((feat, i) => (
            <motion.article
              key={feat.title}
              variants={fadeUp}
              className={`lg:col-span-4 ${
                i === 0 ? "lg:col-span-5 lg:-mt-4" : i === 1 ? "lg:col-span-3 lg:mt-12" : "lg:col-span-4 lg:mt-6"
              }`}
            >
              <div className="manuscript-leaf p-1">
                <div className="px-5 py-7 sm:px-6 sm:py-8">
                  <span className="font-serif text-4xl italic text-[var(--blood)] opacity-30 block mb-4">
                    {feat.mark}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-fg mb-3 leading-tight">
                    {feat.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-[0.95rem] text-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
