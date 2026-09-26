import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { formulas, materialsNote, serviceRows, type Cell, type FormulaId } from '../../../data/content'
import { NBSP, fr } from '../../../lib/fr'
import { useRovingRadio } from '../../../lib/use-roving-radio'
import { cn } from '../../../lib/utils'

type Row = (typeof serviceRows)[number]

// « Écart » du tableau de chrono : calculé depuis les prix, jamais saisi à la main.
const gapLine = (t: number) =>
  t === 0 ? 'Formule de base' : `${formulas[t - 1].name} + ${formulas[t].price - formulas[t - 1].price}${NBSP}€`

const cellOf = (row: Row, t: number): Cell => row.cells[formulas[t].id]
// Ajouté = présent et différent de la formule précédente.
const isAdded = (row: Row, t: number) => t > 0 && cellOf(row, t) !== null && cellOf(row, t) !== cellOf(row, t - 1)

const tabCls =
  'slant-control group relative overflow-hidden text-center transition-[border-color,background-color,translate] duration-200 active:translate-y-px ' +
  // Mobile : onglets au biais de l'italique
  'h-16 -skew-x-10 border border-white/20 hover:border-white/45 aria-checked:border-brand ' +
  // Grand écran : en-têtes de colonnes du tableau
  'lg:h-auto lg:min-h-40 lg:skew-x-0 lg:border-0 lg:border-t-2 lg:border-white/15 lg:p-4 lg:text-left lg:hover:border-white/40 lg:hover:bg-white/[0.04] lg:aria-checked:border-brand ' +
  // Sélection : aplat rouge qui balaie depuis la gauche (pan coupé sur grand écran)
  'before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-brand before:transition-transform before:duration-[220ms] before:ease-out-expo aria-checked:before:scale-x-100 lg:before:cut-tr ' +
  'aria-checked:focus-visible:outline-white'

type Props = { formula: FormulaId; setFormula: (id: FormulaId) => void }

export function FormulaBoard({ formula, setFormula }: Props) {
  const sel = Math.max(0, formulas.findIndex((f) => f.id === formula))
  const getItemProps = useRovingRadio(formulas.length, sel, (i) => setFormula(formulas[i].id))
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)

  return (
    <div>
      <div className="lg:grid lg:grid-cols-(--board-cols)">
        <div className="hidden pr-4 pb-4 lg:flex lg:flex-col lg:justify-end">
          <p className="text-[15px] font-semibold text-white">Ce que comprend chaque formule</p>
          <p className="mt-1 text-[13px] leading-snug text-white/60">
            <Plus aria-hidden className="inline h-3 w-3 align-[-1px] text-brand-light" strokeWidth={3} />
            {fr(' : ajouté par rapport à la formule précédente')}
          </p>
        </div>

        <div role="radiogroup" aria-label="Formule" className="grid grid-cols-3 gap-1.5 px-1.5 lg:col-span-3 lg:grid-cols-subgrid lg:gap-0 lg:px-0">
          {formulas.map((f, i) => (
            <button
              key={f.id}
              id={`formula-${f.id}`}
              {...getItemProps(i)}
              aria-describedby={`gap-${f.id} tier-${f.id}`}
              className={tabCls}
            >
              <span className="relative z-10 flex h-full flex-col items-center justify-center max-lg:skew-x-10 lg:items-start lg:justify-start">
                <span className="font-display text-[13px] leading-tight font-bold text-white/85 italic uppercase group-aria-checked:text-white lg:text-lg lg:text-white xl:text-xl">
                  {f.name}
                </span>{' '}
                <span className="font-display text-[22px] leading-none font-bold italic lg:mt-3 lg:text-[2.75rem] xl:text-[3.5rem]">
                  {f.price}
                  <span className="ml-0.5 text-[0.45em] text-brand-light group-aria-checked:text-white">€</span>
                </span>
                <span id={`gap-${f.id}`} aria-hidden className="mt-3 hidden text-[13px] text-white/60 tabular-nums group-aria-checked:text-white/90 lg:block">{gapLine(i)}</span>
                <span id={`tier-${f.id}`} aria-hidden className="mt-1 hidden text-[13px] leading-[1.45] text-pretty text-white/60 group-aria-checked:text-white/90 lg:block">
                  {f.tagline}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[15px] text-mist lg:hidden">
        {formulas[sel].tagline} · <span className="tabular-nums">{gapLine(sel)}</span>
      </p>

      <table role="table" className="mt-5 block w-full lg:mt-0">
        <caption className="sr-only">Contenu de chaque formule</caption>
        <thead role="rowgroup" className="sr-only">
          <tr role="row">
            <th role="columnheader" scope="col">
              Prestation
            </th>
            {formulas.map((f) => (
              <th key={f.id} role="columnheader" scope="col">
                {f.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" className="block">
          {serviceRows.map((row, r) => {
            const missing = cellOf(row, sel) === null
            const last = r === serviceRows.length - 1
            return (
              <tr
                role="row"
                key={row.id}
                className="grid min-h-13 grid-cols-[minmax(0,1fr)_auto] border-b border-white/8 lg:min-h-14 lg:grid-cols-(--board-cols)"
              >
                <th
                  role="rowheader"
                  scope="row"
                  className={cn('flex flex-col justify-center py-3 pr-3 text-left text-[15px] font-normal', missing ? 'text-white/55 lg:text-white/85' : 'text-white/85')}
                >
                  {row.label}
                  {row.note && <span className="block text-[13px] text-mist">{row.note}</span>}
                </th>
                {formulas.map((f, t) => {
                  const isSel = t === sel
                  return (
                    <td
                      role="cell"
                      key={f.id}
                      // Confort à la souris : cliquer une case choisit sa colonne (les radios restent la commande clavier).
                      onClick={() => setFormula(f.id)}
                      onPointerEnter={() => setHoveredCol(t)}
                      onPointerLeave={() => setHoveredCol(null)}
                      className={cn(
                        'relative flex items-center gap-1.5 text-sm transition-colors duration-[160ms] lg:cursor-pointer lg:px-4',
                        isSel ? 'justify-end text-right lg:justify-start lg:bg-brand/[0.07] lg:text-left' : 'max-lg:hidden',
                        !isSel && hoveredCol === t && 'lg:bg-white/[0.03]',
                        isSel && last && 'lg:after:absolute lg:after:inset-x-0 lg:after:-bottom-px lg:after:h-0.5 lg:after:bg-brand',
                      )}
                    >
                      <CellContent row={row} t={t} sel={sel} />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <p className="mt-4 max-w-[60ch] text-sm text-white/60">{materialsNote}</p>
    </div>
  )
}

function CellContent({ row, t, sel }: { row: Row; t: number; sel: number }) {
  const value = cellOf(row, t)

  if (value === null) {
    // Sur mobile, seule la colonne choisie s'affiche : on indique quelle formule apporte la prestation, et l'écart de prix.
    const provider = formulas.findIndex((_, i) => cellOf(row, i) !== null)
    return (
      <>
        <span aria-hidden className="text-white/35 max-lg:hidden">
          —
        </span>
        <span className="sr-only max-lg:hidden">non inclus</span>
        {t === sel && provider > sel && (
          <span className="text-[13px] text-white/60 lg:hidden">
            <span className="sr-only">non inclus, </span>
            avec {formulas[provider].name} · +{formulas[provider].price - formulas[sel].price}
            {NBSP}€
          </span>
        )}
      </>
    )
  }

  const added = isAdded(row, t)
  const body =
    value === true ? (
      <>
        <Check aria-hidden className="h-[18px] w-[18px] shrink-0 text-white" />
        <span className="sr-only">inclus</span>
      </>
    ) : (
      value
    )

  if (added) {
    return (
      <>
        <Plus aria-hidden className="h-3 w-3 shrink-0 text-brand-light" strokeWidth={3} />
        <span className="text-white">{body}</span>
        <span className="sr-only">, en plus par rapport à {formulas[t - 1].name}</span>
      </>
    )
  }
  return <span className="text-white/75">{body}</span>
}
