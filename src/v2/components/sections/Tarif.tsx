import type { FormulaId } from '../../data/content'
import { fr } from '../../lib/fr'
import type { Distance } from '../../lib/pricing'
import { FormulaBoard } from './tarif/FormulaBoard'
import { PetOption } from './tarif/PetOption'
import { DistanceSectors } from './tarif/DistanceSectors'
import { EstimateBoard } from './tarif/EstimateBoard'
import { MessagePreview } from './tarif/MessagePreview'

type Props = {
  formula: FormulaId
  setFormula: (id: FormulaId) => void
  petHair: boolean
  setPetHair: (v: boolean) => void
  distance: Distance
  setDistance: (d: Distance) => void
}

// Formules + simulateur en une seule section : chaque prix n'apparaît qu'une fois, plus le total courant.
export function Tarif({ formula, setFormula, petHair, setPetHair, distance, setDistance }: Props) {
  const state = { formula, petHair, distance }
  return (
    <section
      id="tarif"
      aria-labelledby="tarif-title"
      className="relative bg-carbon pt-[calc(var(--tape-rise)+4.5rem)] pb-24 [clip-path:polygon(0_var(--tape-rise),100%_0,100%_100%,0_100%)] lg:pt-[calc(var(--tape-rise)+7rem)] lg:pb-32"
    >
      {/* Anciennes ancres conservées */}
      <span id="formules" />
      <span id="simulateur" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2
          id="tarif-title"
          className="font-display text-[clamp(2.25rem,9vw,2.75rem)] leading-[0.95] font-bold tracking-[-0.01em] text-balance italic uppercase sm:text-[3.75rem] lg:text-[4.5rem]"
        >
          Votre tarif,
          <span className="block text-brand-light">déplacement compris.</span>
        </h2>
        <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-white/70 lg:text-lg">
          {fr('Choisissez la formule, l’option et la distance : le total s’affiche et part tel quel dans votre message.')}
        </p>

        {/* Grand écran : les commandes et l'aperçu du message à gauche, le panneau d'estimation collé à droite
            sur toute la hauteur des deux rangées. Mobile : commandes → estimation → message. */}
        <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="lg:col-start-1 lg:row-start-1">
            <FormulaBoard formula={formula} setFormula={setFormula} />
            <div className="mt-10 border-t border-white/10 pt-10">
              <PetOption petHair={petHair} setPetHair={setPetHair} />
            </div>
            <div className="mt-10 border-t border-white/10 pt-10">
              <DistanceSectors distance={distance} setDistance={setDistance} />
            </div>
          </div>

          <EstimateBoard
            id="estimate"
            state={state}
            className="mt-12 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-start"
          />

          <MessagePreview state={state} className="mt-6 lg:col-start-1 lg:row-start-2 lg:mt-10 lg:border-t lg:border-white/10 lg:pt-10" />
        </div>
      </div>
    </section>
  )
}
