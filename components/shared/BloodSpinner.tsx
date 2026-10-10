import { cn } from "@/lib/utils"

type BloodSpinnerProps = {
  size?: "sm" | "md" | "lg"
  label?: string
  className?: string
}

const SIZE = {
  sm: "size-8",
  md: "size-14",
  lg: "size-24",
} as const

/**
 * Occult letterpress loading mark — spinning ring + ink drips.
 * Pure CSS so it still reads while JS is busy.
 */
export function BloodSpinner({ size = "md", label, className }: BloodSpinnerProps) {
  return (
    <div
      className={cn("inline-flex flex-col items-center gap-4", className)}
      role="status"
      aria-live="polite"
      aria-label={label ?? "Loading"}
    >
      <div className={cn("relative", SIZE[size])}>
        <span className="blood-spinner-ring" aria-hidden />
        <span className="blood-spinner-ring blood-spinner-ring--lag" aria-hidden />
        <span className="blood-spinner-core" aria-hidden />
        <span className="blood-spinner-drip blood-spinner-drip--a" aria-hidden />
        <span className="blood-spinner-drip blood-spinner-drip--b" aria-hidden />
        <span className="blood-spinner-drip blood-spinner-drip--c" aria-hidden />
      </div>
      {label && (
        <p className="font-serif italic text-sm sm:text-base text-muted text-center max-w-xs horror-flicker">
          {label}
        </p>
      )}
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  )
}
