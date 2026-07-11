export function fadeIn(el: HTMLAudioElement | null, target = 0.35, ms = 1500) {
  if (!el) return
  const steps = 20
  const delta = target / steps
  let v = el.volume
  const id = setInterval(() => {
    v = Math.min(v + delta, target)
    el.volume = v
    if (v >= target) clearInterval(id)
  }, ms / steps)
}

export function fadeOut(el: HTMLAudioElement | null, ms = 1500) {
  if (!el) return
  const steps = 20
  const delta = el.volume / steps
  const id = setInterval(() => {
    el.volume = Math.max(el.volume - delta, 0)
    if (el.volume <= 0) {
      clearInterval(id)
      el.pause()
      el.src = ""
    }
  }, ms / steps)
}
