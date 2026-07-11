import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { useRouterState } from "@tanstack/react-router"
import { RandomAmbientAudio } from "~/components/layout/RandomAmbientAudio"

const STORAGE_KEY = "nightfall-ambient-sound"

type AmbientSoundContextValue = {
  enabled: boolean
  toggle: () => void
  setEnabled: (enabled: boolean) => void
}

const AmbientSoundContext = createContext<AmbientSoundContextValue | null>(null)

function getInitialEnabled(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(STORAGE_KEY) === "true"
}

function isStoryRoute(pathname: string) {
  return pathname.startsWith("/story/")
}

export function AmbientSoundProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [enabled, setEnabledState] = useState(getInitialEnabled)

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next)
    localStorage.setItem(STORAGE_KEY, String(next))
  }, [])

  const toggle = useCallback(() => {
    setEnabledState((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  const playing = enabled && !isStoryRoute(pathname)

  return (
    <AmbientSoundContext.Provider value={{ enabled, toggle, setEnabled }}>
      <RandomAmbientAudio enabled={playing} />
      {children}
    </AmbientSoundContext.Provider>
  )
}

export function useAmbientSound() {
  const ctx = useContext(AmbientSoundContext)
  if (!ctx) throw new Error("useAmbientSound must be used within AmbientSoundProvider")
  return ctx
}
