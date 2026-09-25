import { useState, type CSSProperties } from 'react'
import { Check, Plus } from 'lucide-react'
import { formulas, materialsNote, serviceMatrix, type Cell, type FormulaId } from '../../../data/content'
import { useRovingRadio } from '../../../lib/use-roving-radio'
import { cn } from '../../../lib/utils'
import { Stitch } from '../../ui/stitch'

type Props = { formula: FormulaId; onSelect: (id: FormulaId) => void }

const ids = formulas.map((f) => f.id)
const sameCell = (a: Cell, b: Cell) => (a?.text ?? '') === (b?.text ?? '') && !!a?.check === !!b?.check

// Une cellule est « ajoutée » quand elle existe et diffère de la formule de gauche.
const isAdded = (cells: Record<FormulaId, Cell>, t: number) => t > 0 && cells[ids[t]] !== null && !sameCell(cells[ids[t]], cells[ids[t - 1]])

// Perforation de l'insert de siège : la seule texture de la page, confinée à la colonne choisie.
const perforated = 'bg-steel [background-image:radial-gradient(circle,var(--color-perf)_0.9px,transparent_1.2px)] [background-size:7px_7px]'

export function Matrix({ formula, onSelect }: Props) {
  const index = ids.indexOf(formula)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const radio = useRovingRadio(ids.length, index, (i) => onSelect(ids[i]))
  const slide: CSSProperties = { transform: `translateX(${index * 100}%)` }

  return (
    <div>
      {/* Légende : au-dessus des onglets sur mobile, dans la première colonne sur desktop */}
      <div className="lg:hidden">
        <Legend />
      </div>

      <div className="relative isolate z-20 mt-4 grid grid-cols-3 border-b border-rule bg-ink pb-2 max-lg:sticky max-lg:top-14 max-lg:-mx-4 max-lg:px-3 max-lg:pt-2 lg:mt-0 lg:grid-cols-[30%_repeat(3,minmax(0,1fr))] lg:border-b-0 lg:pb-0">
        <div className="hidden pr-6 lg:block lg:self-end lg:pb-4">
          <Legend />
        </div>

        <div role="radiogroup" aria-label="Formule" className="relative col-span-3 grid grid-cols-subgrid">
          {/* Bloc rouge unique qui glisse sous l'onglet choisi */}
          <span aria-hidden className="absolute inset-y-0 left-0 z-[4] w-1/3 px-1 transition-transform duration-[260ms] ease-out-expo" style={slide}>
            <span className="block h-full cut bg-brand" />
          </span>

          {formulas.map((f, i) => {
            const checked = i === index
            return (
              <button
                key={f.id}
                type="button"
                {...radio(i)}
                aria-label={`${f.name}, ${f.price} €`}
                onMouseEnter={() => setHoveredCol(i)}
                onMouseLeave={() => setHoveredCol(null)}
                className={cn(
                  'group relative mx-1 flex min-h-[5.25rem] flex-col justify-start p-2.5 text-left outline-none sm:min-h-[6.5rem] sm:p-3 lg:min-h-[9.5rem] lg:p-4',
                  // anneau + écart de focus chanfreinés (sous le cadre et le bloc rouge)
                  'before:pointer-events-none before:absolute before:-inset-1 before:z-[1] before:cut before:[--c:calc(var(--cut)_+_2.34px)] before:opacity-0 focus-visible:before:opacity-100',
                  'after:pointer-events-none after:absolute after:-inset-0.5 after:z-[2] after:cut after:[--c:calc(var(--cut)_+_1.17px)] after:bg-[var(--surface)] after:opacity-0 focus-visible:after:opacity-100',
                  checked ? 'before:bg-white on-red' : 'before:bg-brand-light',
                )}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 z-[3] cut cut-frame transition-colors duration-[160ms] [--frame:rgb(255_255_255/.15)] group-hover:bg-white/[0.04] group-hover:[--frame:rgb(255_255_255/.4)]"
                />
                <span className="relative z-[5] block">
                  <span className="block font-display text-[0.95rem] leading-none font-bold italic uppercase sm:text-base xl:text-xl">{f.name}</span>
                  <span className="mt-2 block font-display text-[1.75rem] leading-none font-bold italic sm:text-[2.25rem] lg:mt-3 lg:text-[2.75rem] xl:text-[3.25rem]">
                    {f.price}
                    <span className={cn('ml-[0.08em] text-[0.45em] transition-colors duration-[160ms]', checked ? 'text-white' : 'text-brand-light')}>€</span>
                  </span>
                  <span
                    className={cn(
                      'mt-2 hidden text-sm leading-snug transition-colors duration-[160ms] sm:block lg:mt-3',
                      checked ? 'text-white' : 'text-white/65',
                    )}
                  >
                    {f.tagline}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tableau comparatif : les colonnes sont aussi cliquables */}
      <div className="relative mt-2 lg:mt-3">
        {/* Insert de siège (desktop) : un seul élément qui glisse avec le bloc rouge */}
        <span
          aria-hidden
          className={cn('absolute inset-y-0 left-[30%] z-0 hidden w-[23.333%] transition-transform duration-[260ms] ease-out-expo lg:block', perforated)}
          style={slide}
        >
          <Stitch vertical className="absolute inset-y-0 left-1.5" />
          <Stitch vertical className="absolute inset-y-0 right-1.5" />
        </span>

        <table role="table" className="relative z-10 w-full table-fixed border-collapse max-lg:block">
          <caption className="sr-only">Prestations incluses par formule</caption>
          <colgroup className="max-lg:hidden">
            <col className="w-[30%]" />
            <col className="w-[23.333%]" />
            <col className="w-[23.333%]" />
            <col className="w-[23.333%]" />
          </colgroup>
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
          <tbody role="rowgroup" className="max-lg:block">
            {serviceMatrix.map((row) => (
              <tr key={row.id} role="row" className="border-b border-rule max-lg:grid max-lg:grid-cols-3 lg:h-[52px]">
                <th
                  scope="row"
                  role="rowheader"
                  className="text-left text-[15px] font-normal text-white/80 max-lg:col-span-3 max-lg:pt-3 max-lg:pb-1 max-lg:text-[13px] max-lg:text-mist lg:pr-4"
                >
                  {row.label}
                  {row.note && <span className="block text-[13px] text-mist max-lg:inline max-lg:before:content-['_·_']">{row.note}</span>}
                </th>
                {ids.map((id, t) => {
                  const selected = t === index
                  return (
                    <td
                      key={id}
                      role="cell"
                      onClick={() => onSelect(id)}
                      onMouseEnter={() => setHoveredCol(t)}
                      onMouseLeave={() => setHoveredCol(null)}
                      className={cn(
                        'relative cursor-pointer px-2 text-center text-sm transition-colors duration-[160ms] max-lg:flex max-lg:h-12 max-lg:items-center max-lg:justify-center max-lg:px-1.5 max-sm:text-[13px]',
                        hoveredCol === t && !selected && 'bg-white/[0.03]',
                        selected && perforatedMobile,
                      )}
                    >
                      {selected && (
                        <span aria-hidden className="lg:hidden">
                          <Stitch vertical className="absolute inset-y-0 left-[3px]" />
                          <Stitch vertical className="absolute inset-y-0 right-[3px]" />
                        </span>
                      )}
                      <CellContent cell={row.cells[id]} added={isAdded(row.cells, t)} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 max-w-[60ch] text-sm leading-[1.55] text-mist">{materialsNote}</p>
    </div>
  )
}

const perforatedMobile =
  'max-lg:bg-steel max-lg:[background-image:radial-gradient(circle,var(--color-perf)_0.9px,transparent_1.2px)] max-lg:[background-size:7px_7px]'

function Legend() {
  return (
    <div>
      <h3 className="text-base font-semibold text-white">Ce que comprend chaque formule</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-mist">
        <Plus aria-hidden className="h-3.5 w-3.5 shrink-0 text-brand-light" strokeWidth={2.5} />
        en rouge&nbsp;: ce que la formule ajoute
      </p>
    </div>
  )
}

function CellContent({ cell, added }: { cell: Cell; added: boolean }) {
  if (!cell) {
    return (
      <>
        <span aria-hidden className="relative text-white/35">
          —
        </span>
        <span className="sr-only">non inclus</span>
      </>
    )
  }
  if (cell.check) {
    return (
      <span className="relative inline-flex items-center gap-1">
        {added && <Plus aria-hidden className="h-3 w-3 shrink-0 text-brand-light sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />}
        <Check aria-hidden className="h-[18px] w-[18px] text-white" strokeWidth={2} />
        <span className="sr-only">inclus{added ? ', en plus' : ''}</span>
      </span>
    )
  }
  return (
    <span className={cn('relative inline-flex items-start justify-center gap-0.5 leading-snug sm:gap-1', added ? 'text-white' : 'text-white/70')}>
      {added && <Plus aria-hidden className="mt-[0.25em] h-3 w-3 shrink-0 text-brand-light sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />}
      <span>
        {cell.text}
        {added && <span className="sr-only">, en plus</span>}
      </span>
    </span>
  )
}
