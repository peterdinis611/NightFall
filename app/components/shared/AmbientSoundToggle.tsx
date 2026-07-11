import { Volume2, VolumeX } from "lucide-react"
import { useAmbientSound } from "~/lib/ambientSound"

export function AmbientSoundToggle() {
  const { enabled, toggle } = useAmbientSound()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Mute ambient sound" : "Enable ambient sound"}
      aria-pressed={enabled}
      title={enabled ? "Mute atmosphere" : "Enable atmosphere"}
      className="relative flex size-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-bg)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-hover)] transition-colors"
    >
      {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
    </button>
  )
}
