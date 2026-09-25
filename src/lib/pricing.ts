import { formulas, petHairOption, travel, type FormulaId } from '../data/content'

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
  n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €'
