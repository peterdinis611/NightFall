import { useTheme } from "@/lib/theme"

type AppBrandProps = {
  className?: string
  /** @deprecated ignored — brand stays solid ink */
  split?: boolean
}

/** Solid wordmark. No colored suffix, no gradient. */
export function AppBrand({ className }: AppBrandProps) {
  const { appName } = useTheme()
  return <span className={className}>{appName}</span>
}

export function AppTagline({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <span className={className}>
      {theme === "light"
        ? "daylight still hides things"
        : "stories that should not be finished"}
    </span>
  )
}
