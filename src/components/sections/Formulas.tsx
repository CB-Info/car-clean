import { Camera, Check, Crown, MapPin, PawPrint } from 'lucide-react'
import { SectionHeading } from '../ui/section-heading'
import { MagicCard } from '../magicui/magic-card'
import { Reveal } from '../ui/reveal'
import { formulas, petHairOption, travel, type FormulaId } from '../../data/content'
import { cn } from '../../lib/utils'

type Props = { onChoose: (id: FormulaId) => void }

export function Formulas({ onChoose }: Props) {
  return (
    <section id="formules" className="relative px-4 py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_35%_at_50%_45%,rgba(225,6,0,0.12),transparent_70%)]" />
      <SectionHeading
        eyebrow="Nos formules"
        title="Choisissez votre niveau de propreté"
        highlight="propreté"
        subtitle="Trois formules claires, sans surprise. Tout le matériel pro est fourni."
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
        {formulas.map((f, i) => {
          const premium = !!f.highlight
          return (
            <Reveal key={f.id} delay={i * 0.08} className={cn(premium && 'lg:-mt-6')}>
              <MagicCard beam={premium} className={cn('h-full transition-transform duration-300 hover:-translate-y-2', premium && 'shadow-[0_30px_120px_-30px_rgba(225,6,0,0.6)]')}>
                <div className="flex h-full flex-col p-7 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-3xl font-bold italic uppercase">{f.name}</h3>
                      <p className="mt-1 text-sm text-mist">{f.tagline}</p>
                    </div>
                    {premium && (
                      <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-brand px-3 py-1 font-display text-[11px] font-bold uppercase italic">
                        <Crown className="h-3.5 w-3.5" /> {f.highlight}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-end gap-1">
                    <span className={cn('font-display text-7xl leading-none font-bold italic', premium ? 'text-gradient-red' : 'text-white')}>
                      {f.price}
                    </span>
                    <span className="mb-2 font-display text-3xl font-bold italic text-brand">€</span>
                  </div>

                  <div className="my-6 h-px bg-gradient-to-r from-brand/60 via-white/10 to-transparent" />

                  <ul className="flex-1 space-y-3">
                    {f.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-3 text-[15px] text-white/85"
                      >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onChoose(f.id)}
                    className={cn(
                      'mt-8 w-full rounded-full py-3.5 font-display text-sm font-bold uppercase italic tracking-wider transition-all duration-300',
                      premium
                        ? 'bg-brand text-white hover:bg-brand-light hover:shadow-[0_10px_40px_-8px_rgba(225,6,0,0.9)]'
                        : 'border border-white/15 bg-white/5 hover:border-brand hover:bg-brand/10',
                    )}
                  >
                    Choisir {f.name} →
                  </button>
                </div>
              </MagicCard>
            </Reveal>
          )
        })}
      </div>

      <Reveal className="mx-auto mt-10 grid max-w-6xl gap-3 sm:grid-cols-3">
        {[
          { icon: PawPrint, title: petHairOption.label, value: `+${petHairOption.price} €` },
          { icon: MapPin, title: 'Déplacement inclus', value: `jusqu’à ${travel.includedKm} km` },
          { icon: Camera, title: 'Véhicules très sales', value: 'devis sur photo' },
        ].map(({ icon: Icon, title, value }) => (
          <div key={title} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-carbon/70 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-mist">{title}</p>
              <p className="font-display text-lg font-bold italic uppercase">{value}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
