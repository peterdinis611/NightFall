/** Intentionally minimal — heavy FX read as costume, not fear. */
export function HorrorEffects() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 120%, rgba(90,12,18,0.18), transparent 55%)",
      }}
    />
  )
}

export function FogLayer() {
  return null
}

export function HeartbeatVignette() {
  return null
}

export function ScanlineOverlay() {
  return null
}

export function BloodDrip() {
  return null
}
