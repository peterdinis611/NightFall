import {
  HauntedScape,
  EmberRain,
  LightningFlash,
  SpiderWebs,
} from "./HauntedScape"

/** Static fog — no scroll-linked JS */
export function FogLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute inset-0 animate-fog-drift opacity-20 motion-reduce:animate-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(120,40,50,0.15) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[40vh] ambient-vignette-pulse motion-reduce:animate-none"
        style={{
          background: "linear-gradient(to top, rgba(8,6,10,0.55) 0%, transparent 100%)",
        }}
      />
    </div>
  )
}

export function HeartbeatVignette() {
  return (
    <div
      className="absolute inset-0 pointer-events-none ambient-vignette-pulse motion-reduce:animate-none"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 50%, rgba(196,30,58,0.1) 100%)",
      }}
    />
  )
}

export function ScanlineOverlay() {
  return null
}

export function BloodDrip() {
  const drips = [8, 22, 38, 55, 72, 88]

  return (
    <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none h-20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blood-500/70 to-transparent" />
      {drips.map((left, i) => (
        <div
          key={left}
          className="absolute top-0 w-[2px] ambient-blood-drip motion-reduce:animate-none"
          style={{
            left: `${left}%`,
            ["--drip-h" as string]: `${24 + (i % 3) * 12}px`,
            ["--drip-dur" as string]: `${2 + i * 0.3}s`,
            ["--drip-delay" as string]: `${i * 0.5}s`,
            background: "linear-gradient(to bottom, #dc2626, #991b1b 60%, transparent)",
          }}
        />
      ))}
    </div>
  )
}

/** Lightweight dark-mode ambient — CSS only, no Framer scroll listeners */
export function HorrorEffects() {
  return (
    <>
      <HauntedScape />
      <FogLayer />
      <EmberRain />
      <HeartbeatVignette />
      <SpiderWebs />
      <LightningFlash />
    </>
  )
}
