import { useEffect, useRef, useState } from 'react'
import { Marquee } from '../magicui/marquee'
import { marqueeItems } from '../../data/content'

const label = `Prestations : ${marqueeItems.map((t) => t.toLowerCase()).join(', ')}`

// Un seul bandeau, animé en CSS (transform uniquement), mis en pause hors écran.
// Incliné de 2°, le bandeau (105 % de large) monte/descend de ~1,8 % de la largeur d'écran à ses extrémités :
// le padding vertical suit donc la largeur (vw), et seul l'axe horizontal est rogné (overflow-x-clip)
// pour ne jamais couper le haut ou le bas du bandeau.
export function BenefitsMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    // Le bandeau croise le bas de la photo du hero, comme une bande de livrée posée sur un panneau.
    <div ref={ref} className="relative z-20 -mt-[max(2rem,4vw)] overflow-x-clip py-[max(1rem,2.5vw)]">
      <p className="sr-only">{label}</p>
      <div aria-hidden className="scale-105 -rotate-2 bg-brand py-4">
        <Marquee duration="40s" repeat={2} paused={!onScreen} className="[--gap:2rem]">
          {marqueeItems.map((t) => (
            <span key={t} className="flex items-center gap-8 font-display text-xl font-bold whitespace-nowrap italic uppercase sm:text-2xl">
              {t}
              {/* Double filet de livrée */}
              <span aria-hidden className="flex gap-[3px]">
                <span className="h-[0.9em] w-1 -skew-x-10 bg-white" />
                <span className="h-[0.9em] w-1 -skew-x-10 bg-white" />
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
