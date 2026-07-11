/**
 * Generates loopable horror ambient WAV files for the story player.
 * Run: node scripts/generate-audio.mjs
 */
import { mkdir, writeFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, "../public/audio")
const SAMPLE_RATE = 44100

function writeWav(samples, path) {
  const numSamples = samples.length
  const buffer = Buffer.alloc(44 + numSamples * 2)
  buffer.write("RIFF", 0)
  buffer.writeUInt32LE(36 + numSamples * 2, 4)
  buffer.write("WAVE", 8)
  buffer.write("fmt ", 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(SAMPLE_RATE, 24)
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write("data", 36)
  buffer.writeUInt32LE(numSamples * 2, 40)
  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]))
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2)
  }
  return writeFile(path, buffer)
}

function seconds(n) {
  return Math.floor(SAMPLE_RATE * n)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function env(t, attack, release, duration) {
  if (t < attack) return t / attack
  if (t > duration - release) return Math.max(0, (duration - t) / release)
  return 1
}

function brownNoise() {
  let last = 0
  return () => {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    return last * 3.5
  }
}

function whiteNoise() {
  return () => Math.random() * 2 - 1
}

function lowPass(prev, input, cutoff = 0.08) {
  return prev + cutoff * (input - prev)
}

function render(durationSec, fn) {
  const len = seconds(durationSec)
  const out = new Float32Array(len)
  fn(out, len, SAMPLE_RATE)
  return out
}

function mix(...tracks) {
  const len = tracks[0].length
  const out = new Float32Array(len)
  for (const track of tracks) {
    for (let i = 0; i < len; i++) out[i] += track[i]
  }
  let peak = 0
  for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(out[i]))
  const gain = peak > 0 ? 0.92 / peak : 1
  for (let i = 0; i < len; i++) out[i] *= gain
  return out
}

const generators = {
  wind_low: () =>
    render(12, (out, len, sr) => {
      const noise = brownNoise()
      let lp = 0
      for (let i = 0; i < len; i++) {
        const t = i / sr
        lp = lowPass(lp, noise(), 0.04)
        const gust = 0.55 + 0.45 * Math.sin(t * 0.35 * Math.PI * 2)
        out[i] = lp * gust * 0.35
      }
    }),

  heartbeat_low: () =>
    render(8, (out, len, sr) => {
      for (let i = 0; i < len; i++) {
        const t = i / sr
        const beat = t % 1.1
        let sample = 0
        if (beat < 0.08) {
          const p = beat / 0.08
          sample = Math.sin(p * Math.PI) * Math.exp(-beat * 18) * 0.7
        } else if (beat > 0.14 && beat < 0.2) {
          const p = (beat - 0.14) / 0.06
          sample = Math.sin(p * Math.PI) * Math.exp(-(beat - 0.14) * 22) * 0.35
        }
        out[i] = sample * Math.sin(t * 0.2 * Math.PI * 2) * 0.15 + sample
      }
    }),

  heartbeat_high: () =>
    render(6, (out, len, sr) => {
      for (let i = 0; i < len; i++) {
        const t = i / sr
        const beat = t % 0.55
        let sample = 0
        if (beat < 0.06) {
          const p = beat / 0.06
          sample = Math.sin(p * Math.PI) * Math.exp(-beat * 24) * 0.85
        }
        out[i] = sample
      }
    }),

  static_burst: () =>
    render(10, (out, len, sr) => {
      const noise = whiteNoise()
      let lp = 0
      for (let i = 0; i < len; i++) {
        const t = i / sr
        lp = lowPass(lp, noise(), 0.5)
        const burst = Math.sin(t * 0.9 * Math.PI * 2) > 0.2 ? 1 : 0.08
        out[i] = lp * burst * 0.25
      }
    }),

  drip_cave: () =>
    render(14, (out, len, sr) => {
      const drips = [1.2, 2.8, 4.1, 6.3, 8.0, 10.5, 12.2]
      for (let i = 0; i < len; i++) {
        const t = i / sr
        let sample = 0
        for (const d of drips) {
          const dt = (t % 14) - d
          if (dt >= 0 && dt < 0.25) {
            sample += Math.sin(dt * 80) * Math.exp(-dt * 20) * 0.35
          }
        }
        out[i] = sample + brownNoise()() * 0.04
      }
    }),

  choir_dissonant: () =>
    render(16, (out, len, sr) => {
      const freqs = [220, 233, 247, 262, 277]
      for (let i = 0; i < len; i++) {
        const t = i / sr
        let sample = 0
        for (let f = 0; f < freqs.length; f++) {
          const drift = Math.sin(t * (0.08 + f * 0.02) * Math.PI * 2) * 2
          sample += Math.sin((t * (freqs[f] + drift) * Math.PI * 2)) * (0.12 - f * 0.015)
        }
        out[i] = sample * (0.7 + 0.3 * Math.sin(t * 0.15 * Math.PI * 2))
      }
    }),

  chase_strings: () =>
    render(10, (out, len, sr) => {
      for (let i = 0; i < len; i++) {
        const t = i / sr
        const base = 180 + t * 8
        const vibrato = Math.sin(t * 7 * Math.PI * 2) * 4
        const phase = (t * (base + vibrato) * Math.PI * 2) % (Math.PI * 2)
        const saw = 2 * (phase / (Math.PI * 2)) - 1
        out[i] = saw * 0.18 * (0.85 + 0.15 * Math.sin(t * 0.5 * Math.PI * 2))
      }
    }),

  breathing_close: () =>
    render(12, (out, len, sr) => {
      const noise = brownNoise()
      let lp = 0
      for (let i = 0; i < len; i++) {
        const t = i / sr
        lp = lowPass(lp, noise(), 0.12)
        const breath = Math.pow(Math.sin(t * 0.22 * Math.PI * 2) * 0.5 + 0.5, 1.8)
        out[i] = lp * breath * 0.45
      }
    }),

  deep_drone: () =>
    render(20, (out, len, sr) => {
      for (let i = 0; i < len; i++) {
        const t = i / sr
        const f1 = 52 + Math.sin(t * 0.04 * Math.PI * 2) * 1.5
        const f2 = 55.5 + Math.sin(t * 0.06 * Math.PI * 2) * 1.2
        out[i] =
          Math.sin(t * f1 * Math.PI * 2) * 0.35 +
          Math.sin(t * f2 * Math.PI * 2) * 0.28 +
          Math.sin(t * 104 * Math.PI * 2) * 0.08
      }
    }),

  door_creak: () =>
    render(12, (out, len, sr) => {
      for (let i = 0; i < len; i++) {
        const t = i / sr
        const cycle = t % 12
        let sample = 0
        if (cycle > 2 && cycle < 5) {
          const p = (cycle - 2) / 3
          const freq = lerp(180, 420, p)
          sample = Math.sin(cycle * freq * Math.PI * 2) * env(cycle - 2, 0.2, 0.8, 3) * 0.2
        }
        out[i] = sample + brownNoise()() * 0.02
      }
    }),

  water_distant: () =>
    render(15, (out, len, sr) => {
      const noise = brownNoise()
      let lp = 0
      for (let i = 0; i < len; i++) {
        const t = i / sr
        lp = lowPass(lp, noise(), 0.06)
        const wave = 0.6 + 0.4 * Math.sin(t * 0.18 * Math.PI * 2)
        out[i] = lp * wave * 0.3 + Math.sin(t * 3.5 * Math.PI * 2) * 0.02
      }
    }),
}

await mkdir(OUT_DIR, { recursive: true })

for (const [name, gen] of Object.entries(generators)) {
  const path = join(OUT_DIR, `${name}.wav`)
  await writeWav(gen(), path)
  console.log(`✓ ${name}.wav`)
}

console.log(`\nGenerated ${Object.keys(generators).length} files in public/audio/`)
