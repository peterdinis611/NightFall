export const AUDIO_TRACKS: Record<string, string> = {
  wind_low:        "/audio/wind_low.wav",
  heartbeat_low:   "/audio/heartbeat_low.wav",
  heartbeat_high:  "/audio/heartbeat_high.wav",
  static_burst:    "/audio/static_burst.wav",
  drip_cave:       "/audio/drip_cave.wav",
  choir_dissonant: "/audio/choir_dissonant.wav",
  chase_strings:   "/audio/chase_strings.wav",
  silence:         "",
  breathing_close: "/audio/breathing_close.wav",
  deep_drone:      "/audio/deep_drone.wav",
  door_creak:      "/audio/door_creak.wav",
  water_distant:   "/audio/water_distant.wav",
}

/** All loopable ambient tracks (excludes silence). */
export const AMBIENT_TRACK_URLS = Object.values(AUDIO_TRACKS).filter(Boolean)

export function pickRandomTrack(exclude?: string): string {
  const pool = exclude
    ? AMBIENT_TRACK_URLS.filter((url) => url !== exclude)
    : AMBIENT_TRACK_URLS
  return pool[Math.floor(Math.random() * pool.length)] ?? AMBIENT_TRACK_URLS[0]
}

export function randomTrackDurationMs() {
  return 18_000 + Math.random() * 22_000
}
