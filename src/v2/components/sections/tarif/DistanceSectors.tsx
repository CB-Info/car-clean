import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { SlantButton } from '../../ui/slant-button'
import { travel } from '../../../data/content'
import { NBSP, fr } from '../../../lib/fr'
import { BEYOND_MAX, BEYOND_MIN, euro, isValidBeyondKm, travelFee, travelSectors, type Distance } from '../../../lib/pricing'
import { useRovingRadio } from '../../../lib/use-roving-radio'
import { cn } from '../../../lib/utils'

const sectors = travelSectors()
const UNKNOWN = sectors.length // 7e radio : « Je ne connais pas la distance »
const BEYOND = sectors.findIndex((s) => s.kind === 'beyond')
const lastUpTo = travel.brackets[travel.brackets.length - 1].upTo
const perKm = euro(travel.perKmBeyond)

const parseKm = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : null)
const validKm = (s: string) => {
  const n = parseKm(s)
  return isValidBeyondKm(n) ? n : null
}

const sectorCls =
  'slant-control group relative h-16 -skew-x-10 overflow-hidden text-center transition-[filter,translate] duration-200 active:translate-y-px aria-[checked=false]:hover:brightness-125 ' +
  'before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-brand before:transition-transform before:duration-[220ms] before:ease-out-expo aria-checked:before:scale-x-100 ' +
  'aria-checked:focus-visible:outline-white'

type Props = { distance: Distance; setDistance: (d: Distance) => void }

// Les tranches de prix sont la commande : chaque bloc annonce sa propre plage, rien ne peut être mal aligné.
export function DistanceSectors({ distance, setDistance }: Props) {
  const [raw, setRaw] = useState('')
  const [blurred, setBlurred] = useState(false)

  const selectedIndex = !distance ? -1 : distance.kind === 'sector' ? distance.index : distance.kind === 'beyond' ? BEYOND : UNKNOWN
  const onSelect = (i: number) => {
    if (i === UNKNOWN) return setDistance({ kind: 'unknown' })
    const s = sectors[i]
    setDistance(s.kind === 'sector' ? { kind: 'sector', index: s.index } : { kind: 'beyond', km: validKm(raw) })
  }
  const getItemProps = useRovingRadio(sectors.length + 1, selectedIndex, onSelect)

  const beyondOpen = distance?.kind === 'beyond'
  const n = parseKm(raw)
  const invalid = blurred && raw.trim() !== '' && !isValidBeyondKm(n)
  const fee = beyondOpen ? travelFee(distance) : null

  const updateRaw = (s: string) => {
    setRaw(s)
    setDistance({ kind: 'beyond', km: validKm(s) })
  }
  const step = (delta: 1 | -1) => {
    const next = n === null ? BEYOND_MIN : Math.min(BEYOND_MAX, Math.max(BEYOND_MIN, n + delta))
    setBlurred(false)
    updateRaw(String(next))
  }

  return (
    <div>
      <h3 className="font-display text-lg font-bold italic uppercase">Distance</h3>
      <p className="mt-1 max-w-[60ch] text-sm text-mist">
        {travel.origin
          ? `Distance entre ${travel.origin} et votre adresse.`
          : fr('Choisissez la tranche jusqu’à votre adresse. Pas sûr ? Indiquez votre commune dans le message, on calcule pour vous.')}
      </p>

      <div role="radiogroup" aria-label="Distance" aria-describedby="km-help">
        <div className="mt-5 grid grid-cols-3 gap-x-1.5 gap-y-2 px-1.5 lg:grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.3fr)] lg:gap-1.5">
          {sectors.map((s, i) => {
            // Pas d'aria-label : le nom accessible reprend le texte visible (critère « label in name »),
            // le détail du calcul est donné par #km-help (aria-describedby du groupe).
            return (
              <button key={i} {...getItemProps(i)} className={cn(sectorCls, i % 2 ? 'bg-graphite' : 'bg-steel')}>
                <span className="relative z-10 flex h-full skew-x-10 flex-col items-center justify-center gap-0.5">
                  <span className="text-[13px] text-white/60 tabular-nums group-aria-checked:text-white lg:text-xs">
                    {s.kind === 'beyond' ? `+ de ${s.from}${NBSP}km` : `${s.from}–${s.to}${NBSP}km`}
                  </span>{' '}
                  <span className="font-display text-lg leading-none font-bold whitespace-nowrap text-white italic lg:text-xl">
                    {s.kind === 'beyond' ? (
                      <>
                        <span className="font-sans text-[11px] font-medium not-italic">dès </span>
                        {euro(s.minFee)}
                      </>
                    ) : s.index === 0 ? (
                      'INCLUS'
                    ) : (
                      `+${euro(s.fee)}`
                    )}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <button
          {...getItemProps(UNKNOWN)}
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] underline decoration-brand-light decoration-1 underline-offset-[0.22em] transition-[text-decoration-thickness] hover:decoration-2 aria-checked:font-semibold"
        >
          {selectedIndex === UNKNOWN && <Check aria-hidden className="h-4 w-4 text-brand-light" />}
          Je ne connais pas la distance
        </button>
      </div>

      {/* Au-delà de 50 km : distance exacte, champ vide au départ (aucune distance n'est inventée) */}
      <div inert={!beyondOpen} className={cn('grid transition-[grid-template-rows] duration-[220ms] ease-out-expo', beyondOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-1.5 pt-4 pb-1">
            <label htmlFor="km-exact" className="w-full text-[15px] font-semibold sm:w-auto">
              Distance exacte
            </label>
            <div className="flex items-center gap-2">
              <SlantButton variant="ghost" size="icon" aria-label="Moins un kilomètre" disabled={n === null || n <= BEYOND_MIN} onClick={() => step(-1)}>
                <Minus aria-hidden className="h-4 w-4" />
              </SlantButton>
              <input
                id="km-exact"
                type="number"
                inputMode="numeric"
                min={BEYOND_MIN}
                max={BEYOND_MAX}
                placeholder="ex. 62"
                value={raw}
                aria-invalid={invalid || undefined}
                aria-describedby="km-help km-err"
                onChange={(e) => updateRaw(e.target.value)}
                onBlur={() => setBlurred(true)}
                className="h-12 w-[5.5rem] rounded-[2px] border border-white/20 bg-ink text-center font-display text-[28px] font-bold italic tabular-nums placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:not-italic aria-invalid:border-brand-light"
              />
              <SlantButton variant="ghost" size="icon" aria-label="Plus un kilomètre" disabled={n !== null && n >= BEYOND_MAX} onClick={() => step(1)}>
                <Plus aria-hidden className="h-4 w-4" />
              </SlantButton>
              <span className="text-[15px] text-white/75">km</span>
            </div>
            <span className="text-[15px] font-semibold tabular-nums">
              {fee !== null ? `= +${euro(fee)}` : <span className="font-normal text-white/60">= à préciser</span>}
            </span>
            <p id="km-err" className="w-full text-[13px] text-brand-light" aria-live="polite">
              {invalid ? `Indiquez une distance entre ${BEYOND_MIN} et ${BEYOND_MAX}${NBSP}km.` : ''}
            </p>
          </div>
        </div>
      </div>

      <p id="km-help" className={cn('mt-3 text-[13px] transition-colors', beyondOpen ? 'text-white' : 'text-mist')}>
        {fr(
          `Déplacement inclus jusqu’à ${travel.includedKm} km. Au-delà de ${lastUpTo} km : ${travel.brackets[travel.brackets.length - 1].fee} € + ${perKm.replace(NBSP + '€', '')} € par km supplémentaire.`,
        )}
      </p>
    </div>
  )
}
