"use client"

import { LottieSlot } from "@/components/landing/LottieSlot"
import { HeroDoorway } from "@/components/landing/HeroDoorway"

/**
 * Dark = cellar soot. Light = overcast corridor — daylight that still hides things.
 */
export function HeroAtmosphere({ dark }: { dark: boolean }) {
  const id = dark ? "d" : "l"

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ opacity: dark ? 0.35 : 0.5 }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <filter id={`wallNoise-${id}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n" />
            <feColorMatrix
              type="matrix"
              values={
                dark
                  ? "0 0 0 0 0.05  0 0 0 0 0.03  0 0 0 0 0.02  0 0 0 0.45 0"
                  : "0 0 0 0 0.12  0 0 0 0 0.11  0 0 0 0 0.1  0 0 0 0.28 0"
              }
            />
          </filter>
          <radialGradient id={`stainA-${id}`} cx="28%" cy="38%" r="42%">
            <stop
              offset="0%"
              stopColor={dark ? "#3a1214" : "#9a6a6e"}
              stopOpacity={dark ? 0.55 : 0.28}
            />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`stainB-${id}`} cx="78%" cy="55%" r="35%">
            <stop
              offset="0%"
              stopColor={dark ? "#1a2a24" : "#6a8078"}
              stopOpacity={dark ? 0.4 : 0.18}
            />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`fogGrad-${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop
              offset="0%"
              stopColor={dark ? "#0a0808" : "#b4bcc6"}
              stopOpacity={dark ? 0.85 : 0.7}
            />
            <stop
              offset="55%"
              stopColor={dark ? "#0a0808" : "#c5ccd4"}
              stopOpacity={dark ? 0.2 : 0.2}
            />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`dayBeam-${id}`} x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="#f2f5f8" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#d8e0ea" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect
          width="1440"
          height="900"
          filter={`url(#wallNoise-${id})`}
          opacity={dark ? 0.5 : 0.35}
        />
        <ellipse
          cx="380"
          cy="320"
          rx="420"
          ry="280"
          fill={`url(#stainA-${id})`}
          className="hero-stain-breathe"
        />
        <ellipse
          cx="1100"
          cy="480"
          rx="360"
          ry="300"
          fill={`url(#stainB-${id})`}
          className="hero-stain-breathe hero-stain-breathe--slow"
        />

        {!dark && (
          <polygon
            points="0,0 520,80 480,900 0,900"
            fill={`url(#dayBeam-${id})`}
            className="hero-day-beam"
          />
        )}

        <g
          stroke={dark ? "#2a1816" : "#5a5450"}
          strokeWidth="1"
          opacity={dark ? 0.7 : 0.32}
        >
          <path d="M120 80 C180 200 140 340 220 520 C260 620 200 720 260 860" />
          <path d="M980 40 C1020 180 960 300 1040 480 C1080 600 1000 720 1060 880" />
          <path d="M600 0 L640 200 L610 340 L670 520" opacity="0.5" />
        </g>

        <rect
          x="0"
          y="520"
          width="1440"
          height="380"
          fill={`url(#fogGrad-${id})`}
          className="hero-fog-rise"
        />
      </svg>

      <HeroDoorway dark={dark} />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[
          [12, 78, 9],
          [28, 85, 14],
          [55, 80, 11],
          [72, 88, 16],
          [88, 76, 13],
          [41, 92, 18],
          [18, 70, 12],
          [63, 74, 15],
        ].map(([x, y, dur], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={dark ? 0.15 : 0.16}
            fill={dark ? "#8a8278" : "#3a3834"}
            opacity={dark ? 0.35 : 0.22}
            className="hero-ash"
            style={{ animationDuration: `${dur}s`, animationDelay: `${i * 1.1}s` }}
          />
        ))}
      </svg>

      <LottieSlot
        src="/lottie/ink-bleed.json"
        className={
          dark
            ? "absolute left-[8%] top-[18%] h-36 w-28 sm:h-48 sm:w-40 mix-blend-screen"
            : "absolute left-[6%] top-[16%] h-36 w-28 sm:h-48 sm:w-40 mix-blend-multiply"
        }
        opacity={dark ? 0.55 : 0.45}
        loop={false}
      />

      {/* Candle only in dark — in light it sat on the door as a tan blob */}
      {dark && (
        <LottieSlot
          src="/lottie/candle-ember.json"
          className="absolute right-[8%] top-[12%] h-28 w-16 sm:h-36 sm:w-20"
          opacity={0.7}
        />
      )}

      <LottieSlot
        src="/lottie/moth.json"
        className={
          dark
            ? "absolute right-[14%] top-[26%] h-24 w-20 sm:h-32 sm:w-28"
            : "absolute right-[12%] top-[18%] h-20 w-16 sm:h-28 sm:w-24"
        }
        opacity={dark ? 0.65 : 0.5}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-[45%] hero-mist-veil"
        style={{
          background: dark
            ? "linear-gradient(to top, #030201 10%, rgba(3,2,1,0.7) 40%, transparent 100%)"
            : "linear-gradient(to top, #c5ccd6 8%, rgba(197,204,214,0.82) 42%, transparent 100%)",
        }}
      />
    </div>
  )
}
