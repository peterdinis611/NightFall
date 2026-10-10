"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import { RandomAmbientAudio } from "@/components/layout/RandomAmbientAudio"

const STORAGE_KEY = "nightfall-ambient-sound"

type AmbientSoundContextValue = {
  enabled: boolean
  toggle: () => void
  setEnabled: (enabled: boolean) => void
}

const AmbientSoundContext = createContext<AmbientSoundContextValue | null>(null)

function isStoryRoute(pathname: string) {
  return pathname.startsWith("/story/")
}

export function AmbientSoundProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/"
  // Always false for SSR + first client paint
  const [enabled, setEnabledState] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      setEnabledState(localStorage.getItem(STORAGE_KEY) === "true")
    } catch {
      setEnabledState(false)
    }
    setReady(true)
  }, [])

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next)
    try {
      localStorage.setItem(STORAGE_KEY, String(next))
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(() => {
    setEnabledState((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const playing = ready && enabled && !isStoryRoute(pathname)

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
