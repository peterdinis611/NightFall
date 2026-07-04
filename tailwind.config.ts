import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Crimson Pro'", "'Georgia'", "serif"],
        mono:  ["'JetBrains Mono'", "monospace"],
        sans:  ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        night: {
          50:  "#f4f2f8",
          100: "#e8e4f0",
          200: "#c8c4d8",
          300: "#9894b0",
          400: "#686488",
          500: "#484468",
          600: "#302c50",
          700: "#1e1c38",
          800: "#12101f",
          900: "#0a0814",
          950: "#050508",
        },
        blood: {
          300: "#fca5a5",
          400: "#f87171",
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#450a0a",
        },
        ember: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        fog: {
          400: "#94a3b8",
          500: "#64748b",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          900: "#2e1065",
        },
        mist: {
          300: "#c4c0d8",
          400: "#9894b0",
          500: "#686488",
        },
      },
      boxShadow: {
        glow:    "0 0 24px rgba(220, 38, 38, 0.12), 0 0 64px rgba(139, 92, 246, 0.06)",
        "glow-sm":"0 0 12px rgba(220, 38, 38, 0.15)",
        surface: "0 4px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
        card:    "0 8px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      animation: {
        "fog-drift":    "fogDrift 12s ease-in-out infinite alternate",
        "flicker":      "flicker 0.15s step-end infinite",
        "heartbeat":    "heartbeat 1s ease-in-out infinite",
        "static-noise": "staticNoise 0.08s step-end infinite",
        "fade-in-slow": "fadeIn 2s ease-out forwards",
        "vignette":     "vignette 6s ease-in-out infinite",
        "zoom-slow":    "zoomSlow 20s ease-in-out infinite alternate",
        "jitter":       "jitter 0.08s linear infinite",
        shimmer:        "shimmer 2.5s ease-in-out infinite",
        glitch:         "glitch 0.15s steps(2) forwards",
        "glitch-1":     "glitch1 0.15s steps(2) forwards",
        "glitch-2":     "glitch2 0.15s steps(2) forwards",
        "pulse-slow":   "pulseSlow 4s ease-in-out infinite",
      },
      keyframes: {
        fogDrift: {
          "0%":   { transform: "translateY(0) translateX(0) scale(1)" },
          "100%": { transform: "translateY(-30px) translateX(20px) scale(1.05)" },
        },
        flicker: {
          "0%, 85%, 100%": { opacity: "1" },
          "86%, 92%":      { opacity: "0.2" },
          "87%, 91%":      { opacity: "0.8" },
          "88%, 90%":      { opacity: "0.1" },
          "89%":           { opacity: "0.6" },
        },
        heartbeat: {
          "0%, 100%":  { transform: "scale(1)",    boxShadow: "0 0 0 0 rgba(220,38,38,0)" },
          "14%":       { transform: "scale(1.02)", boxShadow: "0 0 0 8px rgba(220,38,38,0.12)" },
          "28%":       { transform: "scale(1)" },
          "42%":       { transform: "scale(1.015)", boxShadow: "0 0 0 12px rgba(220,38,38,0.06)" },
          "70%":       { transform: "scale(1)",    boxShadow: "0 0 0 0 rgba(220,38,38,0)" },
        },
        staticNoise: {
          "0%":   { backgroundPosition: "0% 0%" },
          "25%":  { backgroundPosition: "50% 25%" },
          "50%":  { backgroundPosition: "25% 75%" },
          "75%":  { backgroundPosition: "75% 50%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        vignette: {
          "0%, 100%": { opacity: "0.6" },
          "50%":      { opacity: "0.9" },
        },
        zoomSlow: {
          "0%":   { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        jitter: {
          "0%":   { transform: "translateX(0)" },
          "25%":  { transform: "translateX(-2px)" },
          "50%":  { transform: "translateX(1px)" },
          "75%":  { transform: "translateX(-1px)" },
          "100%": { transform: "translateX(2px)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "1" },
        },
        glitch: {
          "0%":   { transform: "translate(0)" },
          "33%":  { transform: "translate(-2px, 1px)" },
          "66%":  { transform: "translate(2px, -1px)" },
          "100%": { transform: "translate(0)" },
        },
        glitch1: {
          "0%":   { transform: "translate(0)", clipPath: "inset(0 0 0 0)" },
          "33%":  { transform: "translate(-3px, 0)", clipPath: "inset(20% 0 60% 0)" },
          "66%":  { transform: "translate(3px, 0)", clipPath: "inset(60% 0 10% 0)" },
          "100%": { transform: "translate(0)", clipPath: "inset(0 0 0 0)" },
        },
        glitch2: {
          "0%":   { transform: "translate(0)" },
          "33%":  { transform: "translate(2px, 1px)" },
          "66%":  { transform: "translate(-2px, -1px)" },
          "100%": { transform: "translate(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1" },
        },
      },
      backgroundImage: {
        noise: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config
