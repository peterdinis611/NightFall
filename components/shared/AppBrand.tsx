import { useTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

type AppBrandProps = {
  className?: string
  split?: boolean
}

/** Nightfall in dark mode, lightFall in light mode */
export function AppBrand({ className, split = false }: AppBrandProps) {
  const { theme, appName } = useTheme()

  if (!split) {
    return <span className={className}>{appName}</span>
  }

  if (theme === "light") {
    return (
      <span className={className}>
        light<span style={{ color: "var(--blood)" }}>Fall</span>
      </span>
    )
  }

  return (
    <span className={className}>
      Night<span style={{ color: "var(--blood)" }}>fall</span>
    </span>
  )
}

export function AppTagline({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <span className={cn(className)}>
      {theme === "light"
        ? "where daylight still hides things"
        : "where fear finds a voice"}
    </span>
  )
}
