import { AnimatePresence, m } from 'motion/react'
import { Calculator, MessageSquare, PawPrint, Phone } from 'lucide-react'
import { SectionHeading } from '../ui/section-heading'
import { NumberTicker } from '../magicui/number-ticker'
import { ShimmerButton } from '../magicui/shimmer-button'
import { WhatsAppIcon } from '../ui/brand-icons'
import { formulas, petHairOption, travel, type FormulaId } from '../../data/content'
import { computeTotal, euro } from '../../lib/pricing'
import { smsLink, telLink, whatsappLink } from '../../lib/links'
import { cn } from '../../lib/utils'

type Props = {
  formula: FormulaId
  setFormula: (id: FormulaId) => void
  petHair: boolean
  setPetHair: (v: boolean) => void
  km: number
  setKm: (v: number) => void
}

const MAX_KM = 80

export function Simulator({ formula, setFormula, petHair, setPetHair, km, setKm }: Props) {
  const r = computeTotal(formula, petHair, km)
  const message = `Bonjour CarClean ! Je souhaite réserver la formule ${r.formula.name} (${r.formula.price} €)${
    petHair ? " + l'option poils d'animaux" : ''
  }. Distance estimée : ${km} km. Total estimé : ${euro(r.total)}. Quelles sont vos disponibilités ?`

  return (
    <section id="simulateur" className="relative px-4 py-20 sm:py-24">
      <SectionHeading
        eyebrow="Simulateur"
        title="Votre prix en 10 secondes"
        highlight="prix"
        subtitle="Choisissez votre formule, vos options et votre distance. On s’occupe du reste."
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Contrôles */}
        <div
          className="space-y-8 rounded-3xl border border-white/10 bg-carbon/80 p-6 sm:p-8"
        >
          <div>
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-mist">1 · Formule</p>
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-ink p-1.5">
              {formulas.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormula(f.id)}
                  className="relative rounded-xl px-2 py-3 text-center"
                  aria-pressed={formula === f.id}
                >
                  {formula === f.id && (
                    <m.span
                      layoutId="formula-pill"
                      className="absolute inset-0 rounded-xl bg-brand shadow-[0_8px_30px_-6px_rgba(225,6,0,0.8)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative block font-display text-base font-bold italic uppercase sm:text-lg">{f.name}</span>
                  <span className={cn('relative block text-xs', formula === f.id ? 'text-white' : 'text-mist')}>{f.price} €</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-mist">2 · Option</p>
            <button
              onClick={() => setPetHair(!petHair)}
              role="switch"
              aria-checked={petHair}
              className={cn(
                'flex w-full items-center justify-between rounded-2xl border p-4 transition-colors',
                petHair ? 'border-brand/60 bg-brand/10' : 'border-white/10 bg-ink hover:border-white/25',
              )}
            >
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
                  <PawPrint className="h-5 w-5" />
                </span>
                <span className="text-left">
                  <span className="block font-medium">{petHairOption.label}</span>
                  <span className="block text-sm text-mist">+{petHairOption.price} €</span>
                </span>
              </span>
              <span className={cn('flex h-7 w-12 items-center rounded-full p-1 transition-colors', petHair ? 'bg-brand' : 'bg-line')}>
                <m.span layout transition={{ type: 'spring', stiffness: 600, damping: 30 }} className={cn('h-5 w-5 rounded-full bg-white', petHair && 'ml-auto')} />
              </span>
            </button>
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between">
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-mist">3 · Distance</p>
              <p className="font-display text-3xl font-bold italic">
                {km}
                <span className="text-lg text-brand-light"> km</span>
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={MAX_KM}
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              aria-label="Distance en kilomètres"
              className="range-red w-full"
              style={{ ['--fill' as string]: `${(km / MAX_KM) * 100}%` }}
            />
            <div className="mt-3 flex justify-between text-xs text-mist">
              <span>0</span>
              <span>{travel.includedKm} km inclus</span>
              <span>{MAX_KM} km</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-1.5 text-center text-[11px]">
              {[{ label: `≤${travel.includedKm}`, fee: 'Offert', on: km <= travel.includedKm }, ...travel.brackets.map((b, i) => ({
                label: `${i === 0 ? travel.includedKm : travel.brackets[i - 1].upTo}–${b.upTo}`,
                fee: `${b.fee} €`,
                on: km > (i === 0 ? travel.includedKm : travel.brackets[i - 1].upTo) && km <= b.upTo,
              }))].map((b) => (
                <div key={b.label} className={cn('rounded-lg border px-1 py-2 transition-all', b.on ? 'border-brand bg-brand/15 text-white' : 'border-white/10 text-mist')}>
                  <div>{b.label} km</div>
                  <div className="font-semibold">{b.fee}</div>
                </div>
              ))}
            </div>
            <p className={cn('mt-3 text-xs transition-colors', km > 50 ? 'font-semibold text-brand-light' : 'text-mist')}>Au-delà de 50 km : {euro(travel.perKmBeyond)}/km supplémentaire.</p>
          </div>
        </div>

        {/* Ticket */}
        <div
          className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-steel to-carbon p-6 sm:p-8 lg:sticky lg:top-24 lg:self-start"
        >
          <div className="flex items-center gap-2 text-mist">
            <Calculator className="h-4 w-4 text-brand" />
            <span className="font-display text-sm font-semibold uppercase tracking-widest">Estimation</span>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <Row label={`Formule ${r.formula.name}`} value={euro(r.formula.price)} k={r.formula.id} />
            <Row label={petHairOption.label} value={petHair ? `+${euro(r.pets)}` : '—'} k={String(petHair)} />
            <Row label={`Déplacement (${km} km)`} value={r.travelFee ? `+${euro(r.travelFee)}` : 'Inclus'} k={String(r.travelFee)} />
          </dl>

          <div className="my-6 border-t border-dashed border-white/15" />

          <div className="flex items-end justify-between">
            <span className="font-display text-lg font-semibold uppercase italic text-mist">Total</span>
            <span className="font-display text-6xl leading-none font-bold italic sm:text-7xl">
              <span className="text-gradient-red">
                <NumberTicker value={r.total} decimals={r.total % 1 ? 2 : 0} />
              </span>
              <span className="text-3xl text-brand"> €</span>
            </span>
          </div>

          <div className="mt-8 grid gap-3">
            <ShimmerButton href={whatsappLink(message)} target="_blank" rel="noreferrer" className="w-full py-4">
              <WhatsAppIcon className="h-5 w-5" /> Réserver sur WhatsApp
            </ShimmerButton>
            <div className="grid grid-cols-2 gap-3">
              <ShimmerButton variant="ghost" href={smsLink(message)} className="w-full px-3 text-xs">
                <MessageSquare className="h-4 w-4" /> SMS
              </ShimmerButton>
              <ShimmerButton variant="ghost" href={telLink} className="w-full px-3 text-xs">
                <Phone className="h-4 w-4" /> Appeler
              </ShimmerButton>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-mist">Estimation indicative. Véhicules très sales : devis sur photo.</p>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value, k }: { label: string; value: string; k: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-white/75">{label}</dt>
      <dd className="relative overflow-hidden font-semibold">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={k + value}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="block"
          >
            {value}
          </m.span>
        </AnimatePresence>
      </dd>
    </div>
  )
}
