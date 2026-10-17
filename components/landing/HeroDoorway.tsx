/**
 * Atmospheric doorway — aged frame, ajar leaf, buried figure.
 * Not a stick-figure in a brown box.
 */
export function HeroDoorway({ dark }: { dark: boolean }) {
  const id = dark ? "d" : "l"
  const wood = dark ? "#1e1410" : "#6b5c50"
  const woodDeep = dark ? "#0c0806" : "#4a3e36"
  const woodEdge = dark ? "#3a2820" : "#8a7868"
  const mold = dark ? "#1a2a24" : "#5a6e64"
  const blood = dark ? "#4a1214" : "#6e1a28"

  return (
    <svg
      className="absolute right-0 top-0 h-full w-[min(62vw,760px)]"
      style={{ opacity: dark ? 0.92 : 1 }}
      viewBox="0 0 560 920"
      preserveAspectRatio="xMaxYMid slice"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`void-${id}`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={dark ? "#0a0404" : "#1a1210"} stopOpacity="1" />
          <stop offset="40%" stopColor="#050302" stopOpacity="1" />
          <stop offset="100%" stopColor={dark ? "#030201" : "#0c0a08"} stopOpacity="1" />
        </linearGradient>
        <radialGradient id={`seep-${id}`} cx="48%" cy="28%" r="50%">
          <stop offset="0%" stopColor={blood} stopOpacity={dark ? 0.4 : 0.22} />
          <stop offset="55%" stopColor={blood} stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`jamb-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={woodDeep} />
          <stop offset="45%" stopColor={wood} />
          <stop offset="100%" stopColor={woodDeep} />
        </linearGradient>
        <linearGradient id={`lintel-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={woodEdge} />
          <stop offset="100%" stopColor={woodDeep} />
        </linearGradient>
        <linearGradient id={`doorLeaf-${id}`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor={dark ? "#120c0a" : "#3a322c"} />
          <stop offset="100%" stopColor={dark ? "#080604" : "#1e1814"} />
        </linearGradient>
        <linearGradient id={`floorFog-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark ? "#030201" : "#c5ccd6"} stopOpacity="0" />
          <stop offset="100%" stopColor={dark ? "#030201" : "#c5ccd6"} stopOpacity={dark ? 0.85 : 0.9} />
        </linearGradient>
        <filter id={`soft-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id={`blurFig-${id}`}>
          <feGaussianBlur stdDeviation={dark ? 1.8 : 2.4} />
        </filter>
        <pattern id={`grainWood-${id}`} width="6" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M0 0 L1 40 M3 0 L4 40"
            stroke={dark ? "#000" : "#2a221c"}
            strokeOpacity="0.15"
            strokeWidth="0.4"
          />
        </pattern>
      </defs>

      {/* Wall field behind door */}
      <rect
        x="20"
        y="0"
        width="540"
        height="920"
        fill={dark ? "#080604" : "#aeb6c0"}
        opacity={dark ? 0.5 : 0.55}
      />
      {/* Damp mold patches on plaster */}
      <ellipse cx="70" cy="220" rx="48" ry="90" fill={mold} opacity={dark ? 0.25 : 0.18} />
      <ellipse cx="500" cy="520" rx="60" ry="110" fill={mold} opacity={dark ? 0.2 : 0.14} />
      {/* Peeling wallpaper flap */}
      <path
        d="M48 140 C70 160 78 200 62 240 L48 260 L48 140 Z"
        fill={dark ? "#2a1816" : "#9a8a7a"}
        opacity="0.55"
      />
      <path
        d="M48 140 C70 160 78 200 62 240"
        stroke={blood}
        strokeWidth="0.75"
        opacity="0.4"
      />

      {/* Outer stone/architrave */}
      <rect x="96" y="72" width="348" height="760" fill={`url(#jamb-${id})`} />
      <rect x="96" y="72" width="348" height="760" fill={`url(#grainWood-${id})`} opacity="0.5" />

      {/* Inner reveal */}
      <rect x="118" y="98" width="304" height="708" fill={woodDeep} />

      {/* Opening / void */}
      <rect x="138" y="118" width="264" height="668" fill={`url(#void-${id})`} />
      <ellipse
        cx="270"
        cy="260"
        rx="100"
        ry="170"
        fill={`url(#seep-${id})`}
        className="hero-door-seep"
      />

      {/* Depth lines inside void */}
      <g stroke={dark ? "#1a0c0c" : "#2a1814"} strokeWidth="0.6" opacity="0.35">
        <path d="M160 200 L160 700" />
        <path d="M380 200 L380 700" />
        <path d="M200 140 L200 760" opacity="0.5" />
      </g>

      {/* Ajar door leaf — left edge, angled */}
      <path
        d="M138 118 L198 130 L198 770 L138 786 Z"
        fill={`url(#doorLeaf-${id})`}
        opacity="0.95"
      />
      <path
        d="M148 160 L188 168 M148 280 L188 286 M148 420 L188 424 M148 560 L188 562"
        stroke={woodEdge}
        strokeWidth="0.8"
        opacity="0.35"
      />
      {/* Panel inset on ajar leaf */}
      <path
        d="M152 190 L184 196 L184 360 L152 356 Z"
        stroke={woodEdge}
        strokeWidth="0.7"
        opacity="0.4"
        fill="none"
      />
      {/* Hinges */}
      <rect x="132" y="200" width="10" height="22" rx="1" fill={woodEdge} opacity="0.7" />
      <rect x="132" y="520" width="10" height="22" rx="1" fill={woodEdge} opacity="0.7" />

      {/* Lintel molding */}
      <rect x="110" y="88" width="320" height="18" fill={`url(#lintel-${id})`} />
      <rect x="118" y="104" width="304" height="4" fill={woodEdge} opacity="0.4" />

      {/* Threshold */}
      <path
        d="M118 806 L422 806 L438 832 L102 832 Z"
        fill={woodDeep}
      />
      <path
        d="M130 812 L410 812"
        stroke={woodEdge}
        strokeWidth="1"
        opacity="0.35"
      />

      {/* Skirting left/right of frame */}
      <rect x="40" y="800" width="58" height="28" fill={wood} opacity="0.65" />
      <rect x="442" y="800" width="70" height="28" fill={wood} opacity="0.65" />

      {/* Figure — soft silhouette, slightly too tall, head tilt */}
      <g
        className="hero-figure-wait"
        filter={`url(#blurFig-${id})`}
        opacity={dark ? 0.72 : 0.58}
        transform="rotate(-3 270 450)"
      >
        {/* Head */}
        <ellipse cx="272" cy="278" rx="16" ry="19" fill="#050302" />
        {/* Neck */}
        <rect x="266" y="294" width="12" height="16" fill="#050302" />
        {/* Shoulders / torso */}
        <path
          fill="#050302"
          d="M238 312
             C248 308 258 306 272 306
             C286 306 296 308 306 312
             L318 340
             C322 380 320 440 316 500
             L312 580
             L298 620
             L272 624
             L246 620
             L232 580
             C228 500 226 420 230 360
             Z"
        />
        {/* Arms hanging, one slightly longer */}
        <path
          fill="#050302"
          d="M238 320 C228 360 224 420 226 480 L234 520 L246 516 C244 440 248 370 252 330 Z"
        />
        <path
          fill="#050302"
          d="M306 322 C318 370 322 440 324 520 L312 560 L300 554 C302 460 298 380 292 332 Z"
        />
        {/* Single dull eye glint */}
        <ellipse
          cx="266"
          cy="276"
          rx="2"
          ry="1.2"
          fill={dark ? "#6a2424" : "#8a3030"}
          opacity="0.65"
        />
      </g>

      {/* Cord + bulb (real shape, not a flat circle) */}
      <g className="hero-bulb-group">
        <path
          d="M418 0 C418 40 416 90 416 130"
          stroke={dark ? "#2a2018" : "#5a5048"}
          strokeWidth="1.25"
          fill="none"
        />
        {/* Socket */}
        <rect
          x="410"
          y="128"
          width="12"
          height="10"
          rx="1"
          fill={dark ? "#3a3028" : "#6a6058"}
        />
        {/* Glass */}
        <path
          d="M412 138
             C408 148 406 158 410 168
             C414 176 422 176 426 168
             C430 158 428 148 424 138
             Z"
          fill={dark ? "#c9a878" : "#f0dc9a"}
          className="hero-bulb-flicker"
          opacity={dark ? 0.65 : 0.85}
        />
        {/* Filament */}
        <path
          d="M416 148 L418 158 L420 148"
          stroke={dark ? "#8a4020" : "#c47830"}
          strokeWidth="0.7"
          fill="none"
          opacity="0.7"
        />
        {/* Glow */}
        <ellipse
          cx="418"
          cy="156"
          rx="36"
          ry="44"
          fill={dark ? "#8a4020" : "#e8c070"}
          className="hero-bulb-glow"
          opacity={dark ? 0.1 : 0.18}
          filter={`url(#soft-${id})`}
        />
      </g>

      {/* Frame edge blood hairline */}
      <line
        x1="138"
        y1="118"
        x2="138"
        y2="786"
        stroke={blood}
        strokeWidth="1"
        opacity={dark ? 0.45 : 0.3}
      />

      {/* Floor fog over threshold */}
      <rect x="90" y="780" width="380" height="140" fill={`url(#floorFog-${id})`} />
    </svg>
  )
}
