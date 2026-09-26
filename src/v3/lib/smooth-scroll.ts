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
  // Lenis retranche déjà le scroll-padding-top du <html> (80px, sous la barre fixe) : pas d'offset en plus.
  if (lenis) lenis.scrollTo(el, { duration: 0.8 })
  else el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

// Menu mobile ouvert : on fige le défilement lissé.
export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()
