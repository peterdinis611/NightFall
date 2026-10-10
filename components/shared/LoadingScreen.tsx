import { BloodSpinner } from "@/components/shared/BloodSpinner"

type LoadingScreenProps = {
  message?: string
  submessage?: string
  fullScreen?: boolean
}

export function LoadingScreen({
  message = "Entering the darkness…",
  submessage,
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]/95 backdrop-blur-sm"
          : "flex flex-col items-center justify-center py-24"
      }
    >
      <div className="relative flex flex-col items-center gap-4">
        <BloodSpinner size="lg" label={message} />
        {submessage && (
          <p className="text-xs text-muted font-mono tracking-wide">{submessage}</p>
        )}
      </div>
    </div>
  )
}
