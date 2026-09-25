import { useEffect, useRef, useState } from 'react'
import { Marquee } from '../magicui/marquee'
import { strapItems } from '../../data/content'

// Séparateur : barre inclinée à l'angle de l'italique
export const StrapBar = () => <span aria-hidden className="h-[22px] w-[3px] shrink-0 -skew-x-10 bg-white" />

// Lisière tissée de la sangle : deux filets sombres qui s'inclinent avec la bande
export const Selvedge = () => (
  <>
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-[5px] h-px bg-brand-dark" />
    <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[5px] h-px bg-brand-dark" />
  </>
)

// Sangle 1 : la ceinture. Bande inclinée de 2°, animée en CSS (transform uniquement).
// Incliné de 2°, le bandeau (105 % de large) monte/descend de ~1,8 % de la largeur d'écran à ses extrémités :
// le padding vertical suit donc la largeur (vw), et seul l'axe horizontal est rogné (overflow-x-clip)
// pour ne jamais couper le haut ou le bas du bandeau.
export function BenefitsMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(true)

  // Hors écran, la sangle s'arrête
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative z-10 -mt-[4vw] overflow-x-clip py-[max(1rem,2.5vw)]">
      <p className="sr-only">Prestations : {strapItems.join(', ').toLowerCase()}.</p>
      <div aria-hidden className="on-red relative -rotate-2 scale-105 bg-brand py-4">
        <Selvedge />
        <Marquee duration="40s" repeat={2} pauseOnHover paused={!onScreen} className="[--gap:2rem]">
          {strapItems.map((t) => (
            <span key={t} className="flex items-center gap-8 font-display text-xl font-bold italic uppercase tracking-wide whitespace-nowrap sm:text-2xl">
              {t}
              <StrapBar />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
