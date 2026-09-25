import { formulas, petHairOption, travel, type FormulaId } from '../data/content'

export function computeTravelFee(km: number): number {
  if (km <= travel.includedKm) return 0
  const bracket = travel.brackets.find((b) => km <= b.upTo)
  if (bracket) return bracket.fee
  const last = travel.brackets[travel.brackets.length - 1]
  return last.fee + Math.ceil(km - last.upTo) * travel.perKmBeyond
}

export type Band = 0 | 1 | 2 | 3 | 4
export type Distance = null | { kind: 'band'; band: Band } | { kind: 'beyond'; km: number | null } | { kind: 'unknown' }

// Bornes des tranches : [0, 10, 20, 30, 40, 50]
export const bounds = [0, travel.includedKm, ...travel.brackets.map((b) => b.upTo)]
export const beyondFrom = bounds[bounds.length - 1]

export const isValidBeyondKm = (km: number) => Number.isFinite(km) && km > beyondFrom && km <= travel.maxKm

export function travelFee(d: Distance): number | null {
  if (!d) return null
  if (d.kind === 'band') return d.band === 0 ? 0 : travel.brackets[d.band - 1].fee
  if (d.kind === 'beyond') return d.km != null && isValidBeyondKm(d.km) ? computeTravelFee(d.km) : null
  return null
}

const nb = ' '

export function bandLabel(band: Band): string {
  return band === 0 ? `moins de ${travel.includedKm}${nb}km` : `${bounds[band]}–${bounds[band + 1]}${nb}km`
}

export function distanceLabel(d: Distance): string {
  if (!d) return 'à préciser'
  if (d.kind === 'band') return bandLabel(d.band)
  if (d.kind === 'beyond') return d.km != null && isValidBeyondKm(d.km) ? `${d.km}${nb}km` : `plus de ${beyondFrom}${nb}km`
  return 'à calculer'
}

export function computeQuote(formulaId: FormulaId, petHair: boolean, d: Distance) {
  const formula = formulas.find((f) => f.id === formulaId) ?? formulas[0]
  const pets = petHair ? petHairOption.price : 0
  const fee = travelFee(d)
  return { formula, pets, travelFee: fee, total: formula.price + pets + (fee ?? 0), partial: fee === null }
}

// Nombre au format français ; espace insécable avant l'euro.
export const num = (n: number) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })
export const euro = (n: number) => `${num(n)}${nb}€`
