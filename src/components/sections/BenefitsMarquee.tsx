import { Sparkle } from 'lucide-react'
import { Marquee } from '../magicui/marquee'

const items = ['Produits professionnels', 'Respect des matériaux', 'Résultat impeccable', 'À domicile ou au travail', 'Shampouinage sièges', 'Traitement cuir & alcantara']

// Un seul bandeau, animé en CSS (transform uniquement).
export function BenefitsMarquee() {
  return (
    <div className="relative z-10 overflow-hidden py-4">
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
