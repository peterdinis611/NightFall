import { motion } from "framer-motion"

const NOTES = [
  { text: "do not read aloud", side: "left", top: "18%", rotate: -6 },
  { text: "it hears keystrokes", side: "right", top: "34%", rotate: 4 },
  { text: "folio xiii — unfinished", side: "left", top: "58%", rotate: -3 },
  { text: "the margin remembers", side: "right", top: "72%", rotate: 5 },
] as const

/** Living page annotations — the unforgettable grimoire detail */
export function Marginalia() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] hidden lg:block" aria-hidden>
      {NOTES.map((note, i) => (
        <motion.p
          key={note.text}
          className={`absolute font-marginalia text-[11px] tracking-wide text-[var(--verdigris)] opacity-0 ${
            note.side === "left" ? "left-3 xl:left-8" : "right-3 xl:right-8 text-right"
          }`}
          style={{ top: note.top, rotate: `${note.rotate}deg` }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 0.55, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.35 + i * 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {note.text}
        </motion.p>
      ))}
    </div>
  )
}
