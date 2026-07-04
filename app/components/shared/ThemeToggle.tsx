import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "~/lib/theme"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative flex size-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-bg)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-hover)] transition-colors"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="size-4" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? -180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="size-4 text-ember-500" />
      </motion.div>
    </button>
  )
}
