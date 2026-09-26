import { formulas, petHairOption, travel, type FormulaId } from '../data/content'
import { NBSP } from './fr'

// Règle V1 inchangée : forfait par tranche jusqu'à 50 km, puis 20 € + 0,50 € par km entamé au-delà.
export function computeTravelFee(km: number): number {
  if (km <= travel.includedKm) return 0
  const bracket = travel.brackets.find((b) => km <= b.upTo)
  if (bracket) return bracket.fee
  const last = travel.brackets[travel.brackets.length - 1]
  return last.fee + Math.ceil(km - last.upTo) * travel.perKmBeyond
}

export function computeTotal(formulaId: FormulaId, petHair: boolean, km: number) {
  const formula = formulas.find((f) => f.id === formulaId) ?? formulas[0]
  const pets = petHair ? petHairOption.price : 0
  const travelFee = computeTravelFee(km)
  return { formula, pets, travelFee, total: formula.price + pets + travelFee }
}

export const euro = (n: number) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + `${NBSP}€`

export type SectorIndex = 0 | 1 | 2 | 3 | 4

// null = pas encore choisie : aucune distance n'est inventée.
export type Distance = null | { kind: 'sector'; index: SectorIndex } | { kind: 'beyond'; km: number | null } | { kind: 'unknown' }

const lastUpTo = travel.brackets[travel.brackets.length - 1].upTo

export const bounds = [0, travel.includedKm, ...travel.brackets.map((b) => b.upTo)] // [0,10,20,30,40,50]
export const BEYOND_MIN = lastUpTo + 1
export const BEYOND_MAX = 300

export type TravelSector =
  | { kind: 'sector'; index: SectorIndex; from: number; to: number; fee: number }
  | { kind: 'beyond'; from: number; minFee: number }

export function travelSectors(): TravelSector[] {
  const sectors: TravelSector[] = bounds.slice(0, -1).map((from, i) => ({
    kind: 'sector' as const,
    index: i as SectorIndex,
    from,
    to: bounds[i + 1],
    fee: i === 0 ? 0 : travel.brackets[i - 1].fee,
  }))
  sectors.push({ kind: 'beyond', from: lastUpTo, minFee: computeTravelFee(BEYOND_MIN) })
  return sectors
}

export const isValidBeyondKm = (km: number | null): km is number =>
  km !== null && Number.isInteger(km) && km >= BEYOND_MIN && km <= BEYOND_MAX

export function travelFee(d: Distance): number | null {
  if (!d) return null
  if (d.kind === 'sector') return d.index === 0 ? 0 : travel.brackets[d.index - 1].fee
  if (d.kind === 'beyond') return isValidBeyondKm(d.km) ? computeTravelFee(d.km) : null
  return null
}

const range = (i: number) => `${bounds[i]}–${bounds[i + 1]}${NBSP}km`

export function distanceText(d: Distance): string {
  if (!d) return 'à choisir'
  if (d.kind === 'sector') return d.index === 0 ? `moins de ${travel.includedKm}${NBSP}km` : range(d.index)
  if (d.kind === 'beyond') return isValidBeyondKm(d.km) ? `${d.km}${NBSP}km` : `plus de ${lastUpTo}${NBSP}km`
  return 'à calculer'
}

export function computeQuote(formulaId: FormulaId, petHair: boolean, d: Distance) {
  const formula = formulas.find((f) => f.id === formulaId) ?? formulas[0]
  const pets = petHair ? petHairOption.price : 0
  const fee = travelFee(d)
  return { formula, pets, travelFee: fee, total: formula.price + pets + (fee ?? 0), complete: fee !== null }
}
