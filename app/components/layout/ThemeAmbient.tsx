import { useTheme } from "~/lib/theme"
import { HorrorEffects } from "~/components/landing/HorrorEffects"
import { LightHorrorEffects } from "~/components/landing/LightHorrorEffects"

export function ThemeAmbient() {
  const { theme } = useTheme()
  if (theme === "dark") return <HorrorEffects />
  return <LightHorrorEffects />
}
