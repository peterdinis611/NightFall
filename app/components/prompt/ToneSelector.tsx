import { cn } from "~/lib/utils"
import { motion } from "framer-motion"

export type Tone = "atmospheric" | "psychological" | "jumpscare" | "graphic"

const TONES: { id: Tone; label: string; desc: string; icon: string }[] = [
  { id: "atmospheric",   label: "Atmospheric",   desc: "Slow dread, texture, silence", icon: "🌫️" },
  { id: "psychological", label: "Psychological",  desc: "Unreliable reality",           icon: "🪞" },
  { id: "jumpscare",     label: "Jumpscare",      desc: "Sudden, sharp horror",         icon: "⚡" },
  { id: "graphic",       label: "Graphic",        desc: "Visceral, explicit content",   icon: "🩸" },
]

interface Props {
  value: Tone
  onChange: (t: Tone) => void
}

export function ToneSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TONES.map((t) => (
        <motion.button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "option-tile",
            value === t.id && "option-tile-active",
            t.id === "graphic" && value !== t.id && "border-dashed border-blood-800/30"
          )}
        >
          <span className="mr-1">{t.icon}</span>
          <span className="font-semibold">{t.label}</span>
          <p className="mt-0.5 text-[10px] opacity-65 leading-tight">{t.desc}</p>
          {t.id === "graphic" && (
            <span className="mt-1 inline-block text-[9px] font-bold uppercase tracking-wider text-blood-500/80">
              18+ content
            </span>
          )}
        </motion.button>
      ))}
    </div>
  )
}
