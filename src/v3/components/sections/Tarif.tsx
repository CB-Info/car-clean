import { useEffect, useState } from 'react'
import type { FormulaId } from '../../data/content'
import { fr } from '../../lib/fr'
import type { QuoteState } from '../../lib/message'
import type { Distance } from '../../lib/pricing'
import { Stitch } from '../ui/stitch'
import { Gauge } from './tarif/Gauge'
import { Matrix } from './tarif/Matrix'
import { PetOption } from './tarif/PetOption'
import { Summary } from './tarif/Summary'
import { TarifBar } from './tarif/TarifBar'

type Props = {
  state: QuoteState
  tarifTouched: boolean
  setFormula: (id: FormulaId) => void
  setPetHair: (v: boolean) => void
  setDistance: (d: Distance) => void
}

// Le pic de la page : un seul configurateur. Le tableau comparatif EST le sélecteur de formule,
// les tranches de distance sont dessinées sur la jauge, le total roule comme un odomètre.
export function Tarif({ state, tarifTouched, setFormula, setPetHair, setDistance }: Props) {
  // La barre mobile s'efface quand le récapitulatif complet est à l'écran, ou déjà dépassé
  const [summaryReached, setSummaryReached] = useState(false)
  useEffect(() => {
    const el = document.getElementById('demande-total')
    if (!el) return
    const io = new IntersectionObserver(([e]) => setSummaryReached(e.isIntersecting || e.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="tarif" aria-labelledby="tarif-title" className="relative bg-ink pt-20 pb-6 [--surface:var(--color-ink)] lg:pt-28 lg:pb-32">
      <span id="formules" aria-hidden className="absolute top-20 lg:top-28" />
      <span id="simulateur" aria-hidden className="absolute top-20 lg:top-28" />

      <div className="mx-auto max-w-[75rem] px-4 sm:px-8">
        <header className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <h2
            id="tarif-title"
            className="font-display text-[2.6rem] leading-[1.04] font-bold tracking-[-0.01em] italic uppercase lg:col-span-8 lg:text-[clamp(3.25rem,6vw,5.25rem)]"
          >
            Votre prix,
            <br />
            déplacement{' '}
            <span className="relative inline-block">
              compris.
              <Stitch className="absolute inset-x-0 -bottom-[0.12em]" />
            </span>
          </h2>
          <p className="mt-6 max-w-[36ch] text-base leading-[1.6] text-mist lg:col-span-4 lg:mt-0 lg:pb-2">
            {fr('Choisissez une formule dans le tableau, ajoutez l’option, indiquez la distance : le total se calcule ici et part tel quel dans votre message.')}
          </p>
        </header>

        <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="space-y-14 lg:col-span-8 xl:col-span-7">
            <Matrix formula={state.formula} onSelect={setFormula} />
            <PetOption checked={state.petHair} onChange={setPetHair} />
            <Gauge distance={state.distance} onChange={setDistance} touched={tarifTouched} />
          </div>
          <div className="mt-14 lg:col-span-4 lg:col-start-9 lg:sticky lg:top-[88px] lg:mt-0 lg:self-start">
            <Summary state={state} />
          </div>
        </div>
      </div>

      <TarifBar state={state} hidden={summaryReached} />
    </section>
  )
}
