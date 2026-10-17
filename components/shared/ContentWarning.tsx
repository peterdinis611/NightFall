"use client"

import { useState, useEffect } from "react"
import { AppBrand } from "@/components/shared/AppBrand"

const KEY = "nightfall_cw_accepted"

export function ContentWarning() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = typeof window !== "undefined" && localStorage.getItem(KEY)
    if (!accepted) setShow(true)
  }, [])

  function accept() {
    localStorage.setItem(KEY, "1")
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)]/97 px-5">
      <div className="w-full max-w-sm border-t border-[var(--blood)]/40 pt-8">
        <p className="font-serif text-2xl text-fg mb-4 leading-tight">
          <AppBrand /> writes horror.
        </p>
        <p className="text-muted text-sm leading-relaxed mb-8 max-w-[36ch]">
          Psychological dread, violence, death. If you are under 16, leave.
        </p>
        <button type="button" onClick={accept} className="btn-clot w-full">
          I am 16 or older — continue
        </button>
      </div>
    </div>
  )
}
