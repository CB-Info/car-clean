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

// Fait défiler jusqu'à la section et y déplace le focus clavier, pour que la tabulation suivante
// reparte de là et non de la barre de navigation. `focusEl` permet de viser une commande précise.
// Le décalage sous la barre fixe vient de `scroll-padding-top` (html) : Lenis le soustrait déjà,
// scrollIntoView aussi. Ne pas ajouter d'`offset` en plus.
export function scrollToId(id: string, focusEl?: HTMLElement | null) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 0.8 })
  else el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  const target = focusEl ?? el
  if (target === el && !el.hasAttribute('tabindex')) {
    el.setAttribute('tabindex', '-1')
    el.setAttribute('data-focus-target', '')
  }
  target.focus({ preventScroll: true })
}
