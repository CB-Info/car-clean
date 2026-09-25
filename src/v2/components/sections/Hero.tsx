import { Phone } from 'lucide-react'
import { WordReveal } from '../magicui/word-reveal'
import { SlantButton } from '../ui/slant-button'
import { contact, formulas, images, travel, type FormulaId } from '../../data/content'
import { fr } from '../../lib/fr'
import { telLink } from '../../lib/links'
import { scrollToId } from '../../lib/smooth-scroll'
import { unsplashSrcSet } from '../../lib/utils'

// Animations CSS (et non Motion) : visibles dès le premier rendu, sans attendre le JS de Motion.
const delay = (s: number) => ({ style: { animationDelay: `${s}s` } })

export function Hero({ onPick }: { onPick: (id: FormulaId) => void }) {
  return (
    <section id="top" className="relative overflow-x-clip bg-ink">
      {/* Sentinelle : la barre de navigation prend son fond dès qu'elle sort de l'écran */}
      <div id="top-sentinel" aria-hidden className="absolute top-0 h-10 w-px" />
      {/* Le seul halo de la page */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_35%,rgb(225_6_0/0.22),transparent_70%)] lg:bg-[radial-gradient(ellipse_50%_45%_at_28%_55%,rgb(225_6_0/0.22),transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative z-10 pt-28 pb-12 lg:flex lg:min-h-[min(100svh,62rem)] lg:max-w-[36rem] lg:flex-col lg:justify-center lg:pb-24 xl:max-w-[44rem]">
          <WordReveal
            delay={0.05}
            text="L’intérieur de votre voiture, nettoyé sur place."
            highlight={['intérieur']}
            className="font-display text-[2.6rem] leading-[0.95] font-bold tracking-[-0.01em] text-balance italic uppercase sm:text-6xl lg:text-[4.5rem] xl:text-[5.5rem]"
          />

          {/* Sans animation : c'est l'élément LCP mesuré par Lighthouse sur mobile */}
          <p className="mt-6 max-w-[40rem] text-[17px] leading-relaxed text-pretty text-white/75 lg:text-[19px]">
            {fr(
              'Aspiration, shampouinage des sièges, plastiques, vitres, cuir : on vient avec tout le matériel, chez vous ou sur votre lieu de travail, dans l’Ain, l’Isère et le Rhône.',
            )}
          </p>

          <div id="hero-actions" {...delay(0.35)} className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row">
            <SlantButton href={telLink} size="lg" aria-label={`Appeler le ${contact.phoneDisplay}`} className="max-sm:mx-1.5 max-sm:flex max-sm:w-[calc(100%-0.75rem)]">
              <Phone aria-hidden className="h-5 w-5" /> {contact.phoneDisplay}
            </SlantButton>
            <SlantButton
              variant="ghost"
              size="lg"
              arrow
              href="#tarif"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('tarif')
              }}
              className="max-sm:mx-1.5 max-sm:flex max-sm:w-[calc(100%-0.75rem)]"
            >
              Calculer mon prix
            </SlantButton>
          </div>

          <div {...delay(0.45)} className="mt-8 animate-fade-up">
            <ul className="grid grid-cols-3 gap-1.5 px-1.5 sm:flex sm:gap-2">
              {formulas.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => onPick(f.id)}
                    className="group relative h-16 w-full -skew-x-10 overflow-hidden border border-white/20 px-3 text-left transition-[border-color,translate] duration-200 hover:border-brand active:translate-y-px sm:w-auto sm:px-5 before:absolute before:inset-0 before:-translate-x-[101%] before:bg-brand before:transition-transform before:duration-[240ms] before:ease-out-expo hover:before:translate-x-0"
                  >
                    <span className="relative z-10 flex skew-x-10 flex-col">
                      <span className="font-display text-[13px] leading-tight font-bold text-white/60 italic uppercase transition-colors group-hover:text-white">
                        {f.name}
                      </span>{' '}
                      <span className="font-display text-[22px] leading-none font-bold italic sm:text-[28px]">
                        {f.price}
                        <span className="ml-0.5 text-[0.6em] text-brand-light transition-colors group-hover:text-white">€</span>
                      </span>
                      {/* Nom accessible = texte visible + intention (critère « label in name ») */}
                      <span className="sr-only">, voir la formule</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-white/60">{fr(`Déplacement inclus jusqu’à ${travel.includedKm} km`)}</p>
          </div>
        </div>

        {/* Une seule image pour les deux mises en page : bande pleine largeur à l'angle du bandeau sur mobile,
            panneau coupé à l'angle de l'italique à droite sur grand écran. */}
        <div className="relative -mx-4 mt-2 h-[42vw] min-h-40 [container-type:size] [clip-path:polygon(0_var(--tape-rise),100%_0,100%_100%,0_100%)] sm:-mx-6 lg:absolute lg:top-20 lg:right-0 lg:bottom-0 lg:mx-0 lg:mt-0 lg:h-auto lg:w-[40vw] lg:[clip-path:none] xl:w-[42vw]">
          <div className="absolute inset-0 lg:[clip-path:polygon(calc(var(--slant-k)*100cqh)_0,100%_0,100%_100%,0_100%)]">
            <img
              src={images.hero}
              srcSet={unsplashSrcSet(images.hero, [640, 828, 1080, 1600])}
              sizes="(min-width: 1024px) 42vw, 100vw"
              width={1600}
              height={1067}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Filet de livrée parallèle au bord de la photo */}
          <span aria-hidden className="absolute inset-y-0 -left-[18px] hidden w-2 origin-bottom-left -skew-x-10 bg-brand lg:block" />
        </div>
      </div>
    </section>
  )
}
