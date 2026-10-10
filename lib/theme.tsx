"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type Theme = "dark" | "light"

const STORAGE_KEY = "nightfall-theme"

type ThemeContextValue = {
  theme: Theme
  appName: string
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function getAppName(theme: Theme): string {
  return theme === "light" ? "lightFall" : "Nightfall"
}

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark"
  } catch {
    return "dark"
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#08080c" : "#e4e9f2")
  }
  document.title = `${getAppName(theme)} — AI Horror Story Generator`
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always "dark" for SSR + first client paint so markup matches hydration
  const [theme, setThemeState] = useState<Theme>("dark")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const next = readStoredTheme()
    setThemeState(next)
    applyTheme(next)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme, ready])

  const setTheme = useCallback((next: Theme) => setThemeState(next), [])

  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    [],
  )

  return (
    <ThemeContext.Provider
      value={{ theme, appName: getAppName(theme), setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
