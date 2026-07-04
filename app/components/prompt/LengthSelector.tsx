import { cn } from "~/lib/utils"

export type Length = "short" | "medium" | "long"

const OPTIONS: { id: Length; label: string; words: string; scenes: string }[] = [
  { id: "short",  label: "Short",  words: "~300 words", scenes: "4 scenes" },
  { id: "medium", label: "Medium", words: "~700 words", scenes: "6 scenes" },
  { id: "long",   label: "Long",   words: "~1200 words", scenes: "8 scenes" },
]

interface Props {
  value: Length
  onChange: (l: Length) => void
}

export function LengthSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "option-tile flex-1 text-center",
            value === o.id && "option-tile-active"
          )}
        >
          <p className="font-semibold">{o.label}</p>
          <p className="mt-0.5 text-[10px] opacity-60">{o.words}</p>
          <p className="text-[10px] opacity-45">{o.scenes}</p>
        </button>
      ))}
    </div>
  )
}
