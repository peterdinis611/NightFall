/** Light mode ambient — CSS only */
function LightFog() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute inset-0 animate-fog-drift opacity-40 motion-reduce:animate-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 40% 60%, rgba(255,255,255,0.5) 0%, transparent 65%)",
        }}
      />
    </div>
  )
}

function DustMotes() {
  const motes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${(i * 12 + 5) % 90}%`,
    delay: i * 0.7,
    duration: 4 + (i % 3),
    x: i % 2 ? 24 : -24,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {motes.map((m) => (
        <div
          key={m.id}
          className="absolute size-1 rounded-full bg-slate-400/25 ambient-ember motion-reduce:animate-none"
          style={{
            left: m.left,
            top: 0,
            ["--ember-dur" as string]: `${m.duration}s`,
            ["--ember-delay" as string]: `${m.delay}s`,
            ["--ember-x" as string]: `${m.x}px`,
          }}
        />
      ))}
    </div>
  )
}

function SunRays() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0 w-[800px] h-[500px] overflow-hidden opacity-30">
      <div
        className="absolute inset-0 ambient-vignette-pulse motion-reduce:animate-none"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 0%, transparent, rgba(255,220,150,0.15), transparent, rgba(255,220,150,0.1), transparent)",
        }}
      />
    </div>
  )
}

function DistantHills() {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 h-48 overflow-hidden opacity-30">
      <svg viewBox="0 0 1440 200" className="absolute bottom-0 w-full h-auto" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <path
          fill="#9894b0"
          opacity="0.2"
          d="M0,200 L0,120 Q200,80 400,110 T800,90 T1200,100 T1440,85 L1440,200 Z"
        />
      </svg>
    </div>
  )
}

export function LightHorrorEffects() {
  return (
    <>
      <LightFog />
      <SunRays />
      <DistantHills />
      <DustMotes />
    </>
  )
}
