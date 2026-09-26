import { petHairOption, travel, type FormulaId } from '../data/content'
import { bounds, computeQuote, distanceText, euro, isValidBeyondKm, type Distance } from './pricing'
import { NBSP } from './fr'

// Séparateur affiché : insécable avant le point médian, pour qu'aucune ligne ne commence par « · ».
const SEP = `${NBSP}· `

export type QuoteState = { formula: FormulaId; petHair: boolean; distance: Distance }

// Texte de discussion (WhatsApp / SMS) : espaces ordinaires, pas de typographie fr().
const plain = (n: number) => euro(n).replace(/\u00A0/g, ' ')
const lastUpTo = travel.brackets[travel.brackets.length - 1].upTo

function distanceLine(d: Distance, fee: number | null): string {
  if (!d) return 'à préciser'
  if (d.kind === 'unknown') return 'à calculer avec mon adresse'
  if (d.kind === 'beyond') return isValidBeyondKm(d.km) && fee !== null ? `${d.km} km (+${plain(fee)})` : `plus de ${lastUpTo} km, à préciser`
  if (d.index === 0) return `moins de ${travel.includedKm} km (inclus)`
  return `entre ${bounds[d.index]} et ${bounds[d.index + 1]} km (+${plain(fee ?? 0)})`
}

// Chaque ligne : un libellé fixe (k) et, le cas échéant, la valeur issue de la configuration (v).
export type MessageLine = { k: string; v?: string }

export function messageLines(s: QuoteState): MessageLine[] {
  const q = computeQuote(s.formula, s.petHair, s.distance)
  const lines: MessageLine[] = [{ k: 'Bonjour CarClean !' }, { k: 'Formule : ', v: `${q.formula.name} (${plain(q.formula.price)})` }]
  if (s.petHair) lines.push({ k: 'Option poils d’animaux : ', v: `oui (+${plain(petHairOption.price)})` })
  lines.push({ k: 'Distance : ', v: distanceLine(s.distance, q.travelFee) })
  lines.push({ k: q.complete ? 'Total estimé : ' : 'Total hors déplacement : ', v: plain(q.total) })
  lines.push({ k: '' }, { k: 'Adresse / commune : ' }, { k: 'Véhicule : ' }, { k: 'Jours possibles : ' })
  return lines
}

export const buildMessage = (s: QuoteState) => messageLines(s).map((l) => l.k + (l.v ?? '')).join('\n')

// Récapitulatif court affiché (dock mobile, bandeau contact).
export function summaryLine(s: QuoteState): string {
  const q = computeQuote(s.formula, s.petHair, s.distance)
  const d = s.distance
  const dist = !d ? 'distance à choisir' : d.kind === 'unknown' ? 'distance à calculer' : distanceText(d)
  return [q.formula.name, s.petHair && 'poils', dist].filter(Boolean).join(SEP)
}

// À lire au téléphone : la configuration n'est pas perdue quand on appelle.
export function phoneRecap(s: QuoteState): string {
  const q = computeQuote(s.formula, s.petHair, s.distance)
  return `${summaryLine(s)}${SEP}${euro(q.total)}${q.complete ? '' : ' hors déplacement'}`
}

// Phrase annoncée aux lecteurs d'écran quand le total change.
export function announceLine(s: QuoteState): string {
  const q = computeQuote(s.formula, s.petHair, s.distance)
  const d = s.distance
  const parts = [`Formule ${q.formula.name}`]
  if (s.petHair) parts.push('option poils d’animaux')
  if (!d) parts.push('distance à choisir')
  else if (d.kind === 'unknown') parts.push('distance à calculer')
  else if (d.kind === 'sector') parts.push(d.index === 0 ? `déplacement inclus, ${distanceText(d)}` : `déplacement de ${bounds[d.index]} à ${bounds[d.index + 1]} km`)
  else parts.push(isValidBeyondKm(d.km) ? `déplacement de ${d.km} km` : `distance au-delà de ${lastUpTo} km à préciser`)
  return `${q.complete ? 'Total estimé' : 'Total hors déplacement'} : ${euro(q.total)}. ${parts.join(', ')}.`
}
