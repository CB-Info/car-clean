import { ArrowDown, MapPin, Phone } from 'lucide-react'
import { CutButton } from '../ui/cut-button'
import { Stitch } from '../ui/stitch'
import { WordReveal } from '../magicui/word-reveal'
import { contact, formulas, images, travel, type FormulaId } from '../../data/content'
import { fr } from '../../lib/fr'
import { telLink } from '../../lib/links'
import { scrollToId } from '../../lib/smooth-scroll'
import { unsplashSrcSet } from '../../lib/utils'

// Animations CSS (et non Motion) : visibles dès le premier rendu, sans attendre le JS de Motion.
const delay = (s: number) => ({ animationDelay: `${s}s` })

export function Hero({ onPick }: { onPick: (id: FormulaId) => void }) {
  return (
    <section id="top" className="relative isolate overflow-x-clip bg-ink lg:min-h-[100svh]">
      <span id="top-sentinel" aria-hidden className="pointer-events-none absolute top-0 left-0 h-16 w-px" />
      {/* La seule lueur de la page : l'éclairage d'ambiance de l'habitacle, accroché au montant de la photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_40%,rgb(225_6_0/0.22),transparent_70%)] lg:bg-[radial-gradient(ellipse_50%_45%_at_62%_70%,rgb(225_6_0/0.26),transparent_70%)]"
      />

      <div className="mx-auto max-w-[75rem] px-4 sm:px-8 lg:grid lg:min-h-[100svh] lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div className="pt-24 sm:pt-28 lg:col-span-7 lg:pt-32 lg:pb-28 xl:col-span-8">
          <WordReveal
            delay={0.05}
            text="L’intérieur de votre voiture, nettoyé là où elle est garée."
            highlight={['intérieur']}
            className="font-display text-[2.6rem] leading-[0.95] font-bold tracking-[-0.01em] italic uppercase sm:text-6xl lg:text-[clamp(3.4rem,5.4vw,5rem)]"
          />

          {/* Sans animation : c'est l'élément LCP mesuré sur mobile */}
          <p className="mt-6 max-w-[46ch] text-base leading-[1.6] text-white/75 lg:text-lg">
            {fr('Aspiration, shampouinage des sièges, plastiques, vitres, cuir : on vient avec tout le matériel, devant chez vous ou sur le parking du bureau.')}
          </p>

          <div id="hero-actions" style={delay(0.4)} className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row">
            <CutButton href={telLink} size="lg" aria-label={`Appeler le ${contact.phoneDisplay}`} icon={<Phone aria-hidden className="h-5 w-5" />} className="max-sm:w-full">
              {contact.phoneDisplay}
            </CutButton>
            <CutButton
              href="#tarif"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('tarif')
              }}
              variant="outline"
              size="lg"
              className="max-sm:w-full"
            >
              Calculer mon prix
              <ArrowDown aria-hidden className="h-5 w-5" />
            </CutButton>
          </div>

          {/* Rail des prix : chaque prix présélectionne sa formule dans le tarif */}
          <div style={delay(0.5)} className="mt-10 animate-fade-up border-t border-rule pt-5">
            <ul className="grid grid-cols-3 sm:flex sm:items-center sm:gap-6">
              {formulas.map((f, i) => (
                <li key={f.id} className="flex items-center gap-6">
                  {i > 0 && <span aria-hidden className="hidden h-7 w-0.5 -skew-x-10 bg-white/20 sm:block" />}
                  <a
                    href="#tarif"
                    onClick={(e) => {
                      e.preventDefault()
                      onPick(f.id)
                    }}
                    className="group block min-h-14 py-1 pr-2"
                  >
                    <span className="block font-display text-sm leading-none font-bold italic uppercase text-white/60 transition-colors group-hover:text-white/85">
                      {f.name}
                    </span>{' '}
                    <span className="relative mt-1.5 inline-block font-display text-[1.75rem] leading-none font-bold italic transition-colors duration-[160ms] group-hover:text-brand-light group-focus-visible:text-brand-light sm:text-[2.25rem]">
                      {f.price}
                      <span className="ml-[0.06em] text-[0.5em] text-brand-light">€</span>
                      <span className="absolute inset-x-0 -bottom-1.5 [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-300 ease-out-expo group-hover:[clip-path:inset(0)] group-focus-visible:[clip-path:inset(0)]">
                        <Stitch />
                      </span>
                    </span>
                    {/* Nom accessible = texte visible + intention (critère « label in name ») */}
                    <span className="sr-only">, voir la formule</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-sm text-white/60">
              <MapPin aria-hidden className="h-4 w-4 shrink-0 text-brand-light" />
              <span>
                {fr(`Déplacement inclus jusqu’à ${travel.includedKm} km`)} <span className="whitespace-nowrap">· {contact.zone}</span>
              </span>
            </p>
          </div>

          {/* Photo : bande pleine largeur au bord incliné sur mobile, panneau au montant incliné à 10° sur desktop */}
          <div className="relative -mx-4 mt-10 h-[62vw] [container-type:size] sm:-mx-8 lg:absolute lg:top-24 lg:right-0 lg:bottom-0 lg:mx-0 lg:mt-0 lg:h-auto lg:w-[36vw] xl:w-[34vw]">
            <div className="absolute inset-0 bg-steel [clip-path:polygon(0_var(--tilt-rise),100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(calc(var(--slant-k)*100cqh)_0,100%_0,100%_100%,0_100%)]">
              <img
                src={images.hero}
                srcSet={unsplashSrcSet(images.hero, [640, 828, 1080, 1600])}
                sizes="(min-width: 1024px) 36vw, 100vw"
                alt=""
                width={1600}
                height={1067}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <span aria-hidden className="absolute inset-y-0 left-0 hidden w-[3px] origin-bottom-left -skew-x-10 bg-brand-light lg:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
