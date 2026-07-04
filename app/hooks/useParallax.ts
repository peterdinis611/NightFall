import { useScroll, useTransform, type MotionValue } from "framer-motion"

/** Scroll-linked Y offset — factor 0.3 = layer moves ~30% of scroll speed (depth parallax). */
export function useParallaxOffset(factor = 0.3): MotionValue<number> {
  const { scrollY } = useScroll()
  return useTransform(scrollY, (v) => v * factor)
}
