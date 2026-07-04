/**
 * Fixed GPU-backed backdrop — avoids background-attachment: fixed scroll jank.
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
