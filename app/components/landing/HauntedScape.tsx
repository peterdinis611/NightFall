import { motion } from "framer-motion"
import { useParallaxOffset } from "~/hooks/useParallax"

/** Dead forest + moon silhouette at bottom of viewport */
export function HauntedScape() {
  const y = useParallaxOffset(0.22)

  return (
    <motion.div
      style={{ y }}
      className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 h-[45vh] overflow-hidden"
    >
      {/* Moon */}
      <motion.div
        className="absolute top-4 right-[12%] sm:right-[18%]"
        animate={{ opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="size-16 sm:size-24 rounded-full"
          style={{
            background: "radial-gradient(circle at 38% 38%, #c8cdd8 0%, #7880a0 40%, #2e3348 65%, transparent 72%)",
            boxShadow: "0 0 70px rgba(120,128,160,0.1), 0 0 30px rgba(109,92,173,0.06)",
          }}
        />
        {/* Cloud passing moon */}
        <motion.div
          className="absolute -top-2 -left-8 w-32 h-8 rounded-full bg-night-950/80 blur-md"
          animate={{ x: [-20, 40, -20], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Ground fog */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(30,28,56,0.4) 50%, transparent 100%)",
        }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Tree silhouettes SVG */}
      <svg
        viewBox="0 0 1440 320"
        className="absolute bottom-0 w-full h-auto opacity-90"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0814" />
            <stop offset="100%" stopColor="#050508" />
          </linearGradient>
        </defs>
        {/* Far trees */}
        <path
          fill="url(#treeGrad)"
          opacity="0.5"
          d="M0,320 L0,200 Q60,180 80,220 T120,160 T160,200 T200,140 T240,180 L240,320 Z
             M300,320 L300,170 Q340,150 360,190 T400,130 T440,170 T480,120 L480,320 Z
             M600,320 L600,190 Q640,170 660,210 T700,150 T740,190 T780,140 L780,320 Z
             M900,320 L900,160 Q940,140 960,180 T1000,120 T1040,160 T1080,110 L1080,320 Z
             M1200,320 L1200,180 Q1240,160 1260,200 T1300,140 T1340,180 T1380,130 L1380,320 Z
             M1440,320 L1440,200 Q1400,180 1380,220 L1380,320 Z"
        />
        {/* Near trees - jagged */}
        <path
          fill="#050508"
          d="M0,320 L0,240 L20,200 L10,160 L30,120 L20,80 L40,120 L35,160 L50,200 L40,240 L60,180 L55,140 L70,100 L65,60 L80,100 L75,140 L90,180 L85,220 L100,160 L95,120 L110,80 L105,40 L120,80 L115,120 L130,160 L125,200 L140,150 L135,110 L150,70 L145,30 L160,70 L155,110 L170,150 L165,190 L180,140 L175,100 L190,60 L185,20 L200,60 L195,100 L210,140 L205,180 L220,130 L215,90 L230,50 L225,10 L240,50 L235,90 L250,130 L245,170 L260,120 L255,80 L270,40 L265,0 L280,40 L275,80 L290,120 L285,160 L300,110 L295,70 L310,30 L305,0 L320,30 L315,70 L330,110 L325,150 L340,100 L335,60 L350,20 L345,0 L360,20 L355,60 L370,100 L365,140 L380,90 L375,50 L390,10 L385,0 L400,10 L395,50 L410,90 L405,130 L420,80 L415,40 L430,0 L430,320 L0,320 Z
             M430,320 L430,200 L450,160 L440,120 L460,80 L450,40 L470,80 L465,120 L480,160 L475,200 L490,150 L485,110 L500,70 L495,30 L510,70 L505,110 L520,150 L515,190 L530,140 L525,100 L540,60 L535,20 L550,60 L545,100 L560,140 L555,180 L570,130 L565,90 L580,50 L575,10 L590,50 L585,90 L600,130 L595,170 L610,120 L605,80 L620,40 L615,0 L630,40 L625,80 L640,120 L635,160 L650,110 L645,70 L660,30 L655,0 L670,30 L665,70 L680,110 L675,150 L690,100 L685,60 L700,20 L695,0 L710,20 L705,60 L720,100 L715,140 L730,90 L725,50 L740,10 L735,0 L750,10 L745,50 L760,90 L755,130 L770,80 L765,40 L780,0 L780,320 L430,320 Z
             M780,320 L780,220 L800,180 L790,140 L810,100 L800,60 L820,100 L815,140 L830,180 L825,220 L840,170 L835,130 L850,90 L845,50 L860,90 L855,130 L870,170 L865,210 L880,160 L875,120 L890,80 L885,40 L900,80 L895,120 L910,160 L905,200 L920,150 L915,110 L930,70 L925,30 L940,70 L935,110 L950,150 L945,190 L960,140 L955,100 L970,60 L965,20 L980,60 L975,100 L990,140 L985,180 L1000,130 L995,90 L1010,50 L1005,10 L1020,50 L1015,90 L1030,130 L1025,170 L1040,120 L1035,80 L1050,40 L1045,0 L1060,40 L1055,80 L1070,120 L1065,160 L1080,110 L1075,70 L1090,30 L1085,0 L1100,30 L1095,70 L1110,110 L1105,150 L1120,100 L1115,60 L1130,20 L1125,0 L1140,20 L1135,60 L1150,100 L1145,140 L1160,90 L1155,50 L1170,10 L1165,0 L1180,10 L1175,50 L1190,90 L1185,130 L1200,80 L1195,40 L1210,0 L1210,320 L780,320 Z
             M1210,320 L1210,200 L1230,160 L1220,120 L1240,80 L1230,40 L1250,80 L1245,120 L1260,160 L1255,200 L1270,150 L1265,110 L1280,70 L1275,30 L1290,70 L1285,110 L1300,150 L1295,190 L1310,140 L1305,100 L1320,60 L1315,20 L1330,60 L1325,100 L1340,140 L1335,180 L1350,130 L1345,90 L1360,50 L1355,10 L1370,50 L1365,90 L1380,130 L1375,170 L1390,120 L1385,80 L1400,40 L1395,0 L1410,40 L1405,80 L1420,120 L1415,160 L1430,110 L1425,70 L1440,30 L1440,320 L1210,320 Z"
        />
        {/* Grave crosses */}
        <g opacity="0.3" fill="#1e1c38">
          <rect x="200" y="270" width="3" height="30" />
          <rect x="192" y="278" width="19" height="3" />
          <rect x="680" y="275" width="2" height="25" />
          <rect x="674" y="281" width="14" height="2" />
          <rect x="1100" y="272" width="3" height="28" />
          <rect x="1092" y="280" width="19" height="3" />
        </g>
      </svg>

      {/* Ground mist rolling */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-20 opacity-40"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(200,200,220,0.15), transparent, rgba(200,200,220,0.1), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}

/** Falling ash / ember particles */
export function EmberRain() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${(i * 7.3 + 2) % 98}%`,
    delay: (i * 0.4) % 8,
    duration: 6 + (i % 5) * 2,
    size: i % 3 === 0 ? 2 : 1,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: "-2%",
            width: p.size,
            height: p.size,
            background: p.id % 4 === 0 ? "#dc2626" : "#8b6914",
            boxShadow: p.id % 4 === 0 ? "0 0 4px #dc2626" : "0 0 2px #8b6914",
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, (p.id % 2 ? 30 : -30), 0],
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

/** Occasional lightning / screen flicker */
export function LightningFlash() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-[2] bg-white"
      animate={{ opacity: [0, 0, 0, 0, 0.04, 0, 0.08, 0, 0, 0] }}
      transition={{
        duration: 12,
        repeat: Infinity,
        times: [0, 0.7, 0.71, 0.72, 0.73, 0.74, 0.75, 0.76, 0.77, 1],
      }}
    />
  )
}

/** Rotating ritual circle behind hero */
export function RitualCircle() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <motion.svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        className="opacity-[0.06] sm:opacity-[0.08]"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="250" cy="250" r="200" fill="none" stroke="#dc2626" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="160" fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="8 12" />
        <circle cx="250" cy="250" r="120" fill="none" stroke="#dc2626" strokeWidth="0.5" />
        {/* Pentagram */}
        <polygon
          points="250,70 326,220 476,220 356,320 396,470 250,380 104,470 144,320 24,220 174,220"
          fill="none"
          stroke="#dc2626"
          strokeWidth="0.5"
          opacity="0.5"
        />
        {/* Runes/symbols around circle */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const x = 250 + 185 * Math.cos(angle - Math.PI / 2)
          const y = 250 + 185 * Math.sin(angle - Math.PI / 2)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#8b5cf6"
              fontSize="10"
              opacity="0.6"
              fontFamily="serif"
            >
              {["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ"][i]}
            </text>
          )
        })}
      </motion.svg>

      {/* Counter-rotating inner ring */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="size-64 sm:size-80 rounded-full border border-blood-600/10"
          style={{ boxShadow: "inset 0 0 60px rgba(220,38,38,0.05)" }}
        />
      </motion.div>
    </div>
  )
}

/** Spider webs in corners */
export function SpiderWebs() {
  const corners = [
    "top-16 left-4",
    "top-16 right-4 scale-x-[-1]",
    "bottom-32 left-4 scale-y-[-1]",
    "bottom-32 right-4 scale-[-1]",
  ]

  return (
    <>
      {corners.map((pos, i) => (
        <svg
          key={i}
          className={`absolute ${pos} w-24 h-24 opacity-[0.12] pointer-events-none z-[1]`}
          viewBox="0 0 100 100"
          aria-hidden
        >
          <path d="M0,0 L100,0 M0,0 L0,100" stroke="#9894b0" strokeWidth="0.5" fill="none" />
          {[20, 40, 60, 80].map((r) => (
            <path
              key={r}
              d={`M0,0 Q${r},${r/2} ${r},${r}`}
              stroke="#9894b0"
              strokeWidth="0.3"
              fill="none"
            />
          ))}
          {[20, 40, 60, 80].map((r) => (
            <path
              key={`h-${r}`}
              d={`M0,0 Q${r/2},${r} ${r},${r}`}
              stroke="#9894b0"
              strokeWidth="0.3"
              fill="none"
            />
          ))}
        </svg>
      ))}
    </>
  )
}
