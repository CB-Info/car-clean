import { Sparkle } from 'lucide-react'
import { Marquee } from '../magicui/marquee'

const items = ['Produits professionnels', 'Respect des matériaux', 'Résultat impeccable', 'À domicile ou au travail', 'Shampouinage sièges', 'Traitement cuir & alcantara']

// Un seul bandeau, animé en CSS (transform uniquement).
// Incliné de 2°, le bandeau (105 % de large) monte/descend de ~1,8 % de la largeur d'écran à ses extrémités :
// le padding vertical suit donc la largeur (vw), et seul l'axe horizontal est rogné (overflow-x-clip)
// pour ne jamais couper le haut ou le bas du bandeau.
export function BenefitsMarquee() {
  return (
    <div className="relative z-10 overflow-x-clip py-[max(1rem,2.5vw)]">
      <div className="-rotate-2 scale-105 bg-brand py-4">
        <Marquee duration="40s" repeat={2} className="[--gap:2rem]">
          {items.map((t) => (
            <span key={t} className="flex items-center gap-8 font-display text-xl font-bold italic uppercase tracking-wide whitespace-nowrap sm:text-2xl">
              {t}
              <Sparkle className="h-5 w-5 fill-white" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
