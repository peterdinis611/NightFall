/**
 * Fixed GPU-backed backdrop — grain + vignette only.
 * No scanlines (reads as cheap horror filter).
 */
export function ScrollBackdrop() {
  return (
    <>
      <div className="scroll-backdrop scroll-backdrop--gradient" aria-hidden />
      <div className="scroll-backdrop scroll-backdrop--grain" aria-hidden />
      <div className="scroll-backdrop scroll-backdrop--vignette" aria-hidden />
    </>
  )
}
