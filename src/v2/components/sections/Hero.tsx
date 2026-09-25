import { MapPin, Phone, Sparkles } from 'lucide-react'
import { ShimmerButton } from '../magicui/shimmer-button'
import { WordReveal } from '../magicui/word-reveal'
import { contact, images } from '../../data/content'
import { telLink } from '../../lib/links'
import { scrollToId } from '../../lib/smooth-scroll'

// Animations CSS (et non Motion) : visibles dès le premier rendu, sans attendre le JS de Motion.
const fadeUp = (delay: number) => ({ style: { animationDelay: `${delay}s` } })

const stats = [
  { v: '60', pre: 'dès ', suf: ' €', label: 'la prestation' },
  { v: '3', suf: '', label: 'formules au choix' },
  { v: '10', suf: ' km', label: 'déplacement inclus' },
  { v: '100', suf: ' %', label: 'à domicile' },
]

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28">
      {/* Fond statique : image + dégradés, aucun filtre ni animation */}
      <div className="absolute inset-0">
        <img src={images.hero} alt="" width={1600} height={1067} className="h-full w-full object-cover opacity-35" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_62%,rgba(225,6,0,0.28),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center">
        <div
          {...fadeUp(0)}
          className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 sm:text-sm"
        >
          <MapPin className="h-3.5 w-3.5 text-brand" />
          Nettoyage auto à domicile · {contact.zone}
        </div>

        <WordReveal
          delay={0.05}
          text="Votre voiture comme neuve, sans bouger de chez vous."
          highlight={['neuve']}
          className="mt-6 max-w-5xl font-display text-[2.6rem] leading-[0.98] font-bold italic uppercase sm:text-6xl lg:text-[5.5rem]"
        />

        {/* Sans animation : c'est l'élément LCP mesuré par Lighthouse sur mobile */}
        <p className="mt-6 max-w-xl text-base text-white/70 sm:text-lg">
          Aspiration, shampouinage, plastiques, vitres, cuir… On vient chez vous ou au travail avec tout le matériel pro.
          Vous, vous ne faites rien.
        </p>

        <div {...fadeUp(0.4)} className="animate-fade-up mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <ShimmerButton href={telLink} className="px-8 py-4 text-base">
            <Phone className="h-5 w-5" /> {contact.phoneDisplay}
          </ShimmerButton>
          <ShimmerButton
            variant="ghost"
            href="#formules"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('formules')
            }}
            className="px-8 py-4 text-base"
          >
            <Sparkles className="h-5 w-5 text-brand" /> Voir les formules
          </ShimmerButton>
        </div>
      </div>

      <div className="relative mx-auto mt-14 w-full max-w-5xl px-2 pb-16">
        <div {...fadeUp(0.5)} className="animate-fade-up mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
              <p className="font-display text-2xl font-bold italic sm:text-3xl">
                {s.pre && <span className="text-base text-white/60">{s.pre}</span>}
                {s.v}
                <span className="text-brand">{s.suf}</span>
              </p>
              <p className="text-xs text-white/55">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
