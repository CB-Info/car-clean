import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { travel } from '../../../data/content'
import { fr } from '../../../lib/fr'
import { beyondFrom, bounds, computeTravelFee, euro, isValidBeyondKm, num, type Band, type Distance } from '../../../lib/pricing'
import { useRovingRadio } from '../../../lib/use-roving-radio'
import { cn } from '../../../lib/utils'
import { Stitch } from '../../ui/stitch'
import { CutCheckbox } from './PetOption'

type Props = { distance: Distance; onChange: (d: Distance) => void; touched: boolean }

const last = travel.brackets[travel.brackets.length - 1]
const perKm = euro(travel.perKmBeyond)

// Six segments proportionnels : 0–10, 10–20, 20–30, 30–40, 40–50, au-delà.
const segments = [
  { label: 'Inclus', name: `Moins de ${travel.includedKm} km, déplacement inclus` },
  ...travel.brackets.map((b, i) => ({ label: `+${euro(b.fee)}`, name: `De ${bounds[i + 1]} à ${b.upTo} km, ${euro(b.fee)}` })),
  { label: 'Au-delà', name: `Plus de ${beyondFrom} km, ${euro(last.fee)} plus ${perKm} par km au-delà de ${beyondFrom}` },
]
const BEYOND = segments.length - 1

const ruleText = fr(`Au-delà de ${beyondFrom} km : ${euro(last.fee)} + ${perKm} par km au-delà de ${beyondFrom}.`)

const selectedIndex = (d: Distance) => (!d ? -1 : d.kind === 'band' ? d.band : d.kind === 'beyond' ? BEYOND : -1)

export function Gauge({ distance, onChange, touched }: Props) {
  const sel = selectedIndex(distance)
  const unknown = distance?.kind === 'unknown'
  const [kmText, setKmText] = useState('')
  const [kmError, setKmError] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const rulerRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrub = useRef<{ active: boolean; type: string }>({ active: false, type: 'mouse' })

  const parsedKm = kmText.trim() === '' ? null : Number(kmText)
  const validKm = parsedKm != null && Number.isInteger(parsedKm) && isValidBeyondKm(parsedKm) ? parsedKm : null

  const select = (i: number) => {
    if (i === sel) return
    if (i === BEYOND) onChange({ kind: 'beyond', km: validKm })
    else onChange({ kind: 'band', band: i as Band })
  }
  const radio = useRovingRadio(segments.length, sel, select)

  // Glisser le doigt ou la souris sur la jauge : le segment sous le pointeur (graduation non inclinée) est choisi.
  const pick = (x: number) => {
    const cells = rulerRefs.current
    let i = 0
    for (let k = cells.length - 1; k >= 0; k--) {
      const r = cells[k]?.getBoundingClientRect()
      if (r && x >= r.left - 1.5) {
        i = k
        break
      }
    }
    select(i)
  }
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    scrub.current = { active: true, type: e.pointerType }
    e.currentTarget.setPointerCapture(e.pointerId)
    // Au doigt, on attend le geste (un défilement vertical ne doit rien choisir)
    if (e.pointerType === 'mouse') pick(e.clientX)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (scrub.current.active) pick(e.clientX)
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (scrub.current.active && scrub.current.type !== 'mouse') pick(e.clientX)
    scrub.current.active = false
  }
  const stopScrub = () => {
    scrub.current.active = false
  }

  // « Mise du contact » : la jauge s'allume une fois, de gauche à droite, puis se retire et attend.
  const touchedRef = useRef(touched)
  useEffect(() => {
    touchedRef.current = touched
  }, [touched])
  useEffect(() => {
    const el = trackRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer = 0
    let ended = 0
    const finish = () => {
      el.removeAttribute('data-ignite')
      el.removeEventListener('animationend', onEnd)
    }
    const onEnd = (ev: AnimationEvent) => {
      if (ev.animationName === 'ignite' && ++ended >= segments.length) finish()
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        if (touchedRef.current) return
        el.addEventListener('animationend', onEnd)
        el.setAttribute('data-ignite', '')
        timer = window.setTimeout(finish, 1200)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
      finish()
    }
  }, [])

  const onKmChange = (v: string) => {
    const clean = v.replace(/[^\d]/g, '').slice(0, 3)
    setKmText(clean)
    const n = clean === '' ? null : Number(clean)
    const ok = n != null && isValidBeyondKm(n)
    if (ok || clean === '') setKmError(false)
    onChange({ kind: 'beyond', km: ok ? n : null })
  }
  const onKmBlur = () => setKmError(kmText !== '' && validKm === null)

  const beyondOpen = sel === BEYOND

  return (
    <div>
      <h3 id="dist-title" className="font-display text-[1.375rem] leading-none font-bold italic uppercase">
        Distance
      </h3>
      <p className="mt-3 max-w-[58ch] text-sm leading-[1.55] text-mist">
        {travel.origin
          ? fr(`Depuis ${travel.origin}, jusqu’à votre adresse.`)
          : fr('Distance approximative jusqu’à votre adresse. Pas sûr ? Cochez « Je ne connais pas la distance », on la calcule pour vous.')}
      </p>

      <div className={cn('mt-6 transition-opacity duration-[160ms]', unknown && 'opacity-50')}>
        {/* Graduation : même structure que la jauge, graduations tous les 2 km */}
        <div aria-hidden className="flex h-6 gap-[3px] pl-[10px]">
          {segments.map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                rulerRefs.current[i] = el
              }}
              className="relative flex-1"
            >
              {i < BEYOND && (
                <>
                  <span className="absolute bottom-0 left-[-2px] h-2 w-px bg-white/30" />
                  <span
                    className={cn(
                      'absolute bottom-2.5 left-0 text-[13px] leading-none tabular-nums text-mist',
                      i === 0 ? '-translate-x-[1px]' : '-translate-x-1/2',
                    )}
                  >
                    {bounds[i]}
                  </span>
                  {[20, 40, 60, 80].map((p) => (
                    <span key={p} className="absolute bottom-0 h-1 w-px bg-white/20" style={{ left: `${p}%` }} />
                  ))}
                </>
              )}
              {i === BEYOND - 1 && (
                <>
                  <span className="absolute right-[-2px] bottom-0 h-2 w-px bg-white/30" />
                  <span className="absolute bottom-2.5 left-full translate-x-[calc(-50%_+_1.5px)] text-[13px] leading-none tabular-nums text-mist">
                    {bounds[BEYOND]}
                    <span className="absolute left-full ml-1">km</span>
                  </span>
                </>
              )}
              {i === BEYOND && <ArrowRight className="absolute right-0 bottom-0 h-3.5 w-3.5 text-mist" />}
            </div>
          ))}
        </div>

        {/* Jauge : chaque segment est une radio */}
        <div
          ref={trackRef}
          role="radiogroup"
          aria-labelledby="dist-title"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={stopScrub}
          onLostPointerCapture={stopScrub}
          className="gauge flex touch-pan-y gap-[3px] pl-[10px] select-none"
        >
          {segments.map((s, i) => {
            const state = sel < 0 || i > sel ? 'after' : i < sel ? 'before' : 'on'
            return (
              <button
                key={s.label}
                type="button"
                {...radio(i)}
                aria-label={fr(s.name)}
                style={{ '--i': i } as CSSProperties}
                className={cn(
                  'seg group relative flex h-14 min-w-0 flex-1 origin-top -skew-x-10 items-center justify-center overflow-hidden border transition-colors duration-[160ms] max-sm:h-[52px]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  state === 'after' && 'border-white/10 bg-steel text-mist',
                  state === 'before' && 'border-transparent bg-brand-dark text-white/80',
                  state === 'on' && 'on-red border-transparent bg-brand text-white focus-visible:outline-white',
                  'hover:text-white',
                )}
              >
                <span aria-hidden className="pointer-events-none absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-[160ms] group-hover:opacity-100" />
                <span
                  className={cn(
                    'relative z-10 inline-block skew-x-10 text-sm font-semibold whitespace-nowrap max-[400px]:text-[13px]',
                    i > 0 && i < BEYOND && 'tabular-nums',
                  )}
                >
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Au-delà de 50 km : distance exacte (vide au départ, aucune distance inventée) */}
      <div
        className={cn('grid transition-[grid-template-rows] duration-200 ease-out-expo', beyondOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
        inert={!beyondOpen}
      >
        <div className="-mx-2 min-h-0 overflow-hidden px-2">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2 pt-5 pb-2">
            <label htmlFor="km-input" className="pb-2 text-[15px] font-semibold">
              Distance exacte
            </label>
            <span className="inline-flex items-end gap-1.5">
              <span className="relative inline-block">
                <input
                  id="km-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  enterKeyHint="done"
                  placeholder="ex. 62"
                  value={kmText}
                  onChange={(e) => onKmChange(e.target.value)}
                  onBlur={onKmBlur}
                  aria-invalid={kmError || undefined}
                  aria-describedby="km-rule km-err"
                  className="block w-[3.6ch] min-w-[2.2ch] bg-transparent pr-[0.12em] pb-1 font-display text-[2rem] [field-sizing:content] supports-[field-sizing:content]:w-auto leading-none font-bold italic caret-brand-light outline-none placeholder:text-[1.25rem] placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-offset-4"
                />
                <Stitch className="absolute inset-x-0 bottom-0" />
              </span>
              <span className="pb-2 font-display text-lg font-bold italic uppercase">km</span>
            </span>
            <span className="pb-2 text-[15px] font-semibold tabular-nums text-white/85">
              {validKm !== null ? (
                <>
                  <ArrowRight aria-hidden className="mr-1 inline h-4 w-4 align-[-0.15em] text-brand-light" />+{euro(computeTravelFee(validKm))}
                </>
              ) : (
                <span className="text-mist">
                  {euro(last.fee)} + {num(travel.perKmBeyond)}&nbsp;€/km
                </span>
              )}
            </span>
          </div>
          <p id="km-err" role={kmError ? 'alert' : undefined} className={cn('text-sm text-brand-light', kmError ? 'mt-2' : 'sr-only')}>
            {kmError ? fr(`Indiquez une distance entre ${beyondFrom + 1} et ${travel.maxKm} km.`) : ''}
          </p>
        </div>
      </div>

      <p id="km-rule" className={cn('mt-4 text-sm transition-colors duration-[160ms]', beyondOpen ? 'text-brand-light' : 'text-mist')}>
        {ruleText}
      </p>

      <CutCheckbox checked={unknown} onChange={(v) => onChange(v ? { kind: 'unknown' } : null)} className="mt-4 min-h-12 border-y border-rule px-1 py-2">
        <span className="text-[15px] font-semibold">Je ne connais pas la distance</span>
      </CutCheckbox>
    </div>
  )
}
