import Lenis from 'lenis'

let lenis: Lenis | null = null

// Lissage léger : suit la molette de près (lerp élevé) pour garder un défilement réactif.
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ autoRaf: true, lerp: 0.22, wheelMultiplier: 1.15 })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 0.8 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
