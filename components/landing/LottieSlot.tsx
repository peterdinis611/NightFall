"use client"

import { useEffect, useState } from "react"
import { Lottie } from "lottie-react"
import { cn } from "@/lib/utils"

type LottieSlotProps = {
  src: string
  className?: string
  loop?: boolean
  opacity?: number
}

/** Lottie with reduced-motion guard. Give the wrapper a size — animation fills it. */
export function LottieSlot({
  src,
  className,
  loop = true,
  opacity = 1,
}: LottieSlotProps) {
  const [reduceMotion, setReduceMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  if (!mounted || reduceMotion) return null

  return (
    <div
      className={cn("pointer-events-none select-none", className)}
      style={{ opacity }}
      aria-hidden
    >
      <Lottie src={src} loop={loop} autoplay className="h-full w-full" />
    </div>
  )
}
