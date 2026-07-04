import { cn } from "~/lib/utils"

const THEMES = [
  { id: "abandoned-hospital",  label: "Abandoned Hospital",  emoji: "🏥" },
  { id: "deep-sea",            label: "Deep Sea",            emoji: "🌊" },
  { id: "haunted-house",       label: "Haunted House",       emoji: "🏚️" },
  { id: "something-in-woods",  label: "Something in the Woods", emoji: "🌲" },
  { id: "urban-legend",        label: "Urban Legend",        emoji: "🚗" },
  { id: "sci-fi-horror",       label: "Sci-Fi Horror",       emoji: "🛸" },
  { id: "wrong-door",          label: "Wrong Door",          emoji: "🚪" },
  { id: "last-survivor",       label: "Last Survivor",       emoji: "☠️" },
]

interface Props {
  selected: string
  onSelect: (theme: string) => void
}

export function ThemeGrid({ selected, onSelect }: Props) {
  return (
    <div>
      <p className="label-section">Quick themes</p>
      <div className="flex flex-wrap gap-2">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(selected === t.id ? "" : t.id)}
            className={cn(
              "chip",
              selected === t.id && "chip-active"
            )}
          >
            <span>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
