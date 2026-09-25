import type { FormulaId } from '../data/content'
import { plain } from './fr'
import { computeQuote, distanceLabel, euro, travelFee, type Distance } from './pricing'

export type QuoteState = { formula: FormulaId; petHair: boolean; distance: Distance; touched: boolean }

function distanceLine(d: Distance): string {
  const fee = travelFee(d)
  if (!d) return 'Distance : à préciser'
  if (d.kind === 'unknown') return 'Distance : à calculer selon mon adresse'
  if (fee === null) return `Distance : ${distanceLabel(d)}, à préciser`
  if (fee === 0) return `Distance : ${distanceLabel(d)} (inclus)`
  return `Distance : ${distanceLabel(d)} (+${euro(fee)})`
}

// Un seul message, partagé par le récapitulatif, les barres, le menu et l'appel final.
export function buildMessage(s: QuoteState): string {
  const q = computeQuote(s.formula, s.petHair, s.distance)
  const lines = [
    'Bonjour CarClean ! Je souhaite un nettoyage intérieur.',
    `Formule : ${q.formula.name} (${euro(q.formula.price)})`,
    ...(s.petHair ? [`Option poils d’animaux : oui (+${euro(q.pets)})`] : []),
    distanceLine(s.distance),
    q.partial ? `Total hors déplacement : ${euro(q.total)}` : `Total calculé sur le site : ${euro(q.total)}`,
    '',
    'Adresse / commune : ',
    'Véhicule : ',
    'Jours possibles : ',
  ]
  return plain(lines.join('\n'))
}

// Message générique, quand rien n'a été configuré.
export const genericMessage = plain(
  ['Bonjour CarClean ! Je souhaite un nettoyage intérieur.', '', 'Adresse / commune : ', 'Véhicule : ', 'Jours possibles : '].join('\n'),
)

function distancePart(d: Distance): string {
  if (!d) return 'distance à préciser'
  if (d.kind === 'unknown') return 'distance à calculer'
  return distanceLabel(d)
}

// « Gold · poils · 10–20 km »
export function summaryLine(s: QuoteState): string {
  const q = computeQuote(s.formula, s.petHair, s.distance)
  return [q.formula.name, ...(s.petHair ? ['poils'] : []), distancePart(s.distance)].join(' · ')
}

// « Gold · poils · 10–20 km · 110 € » — à lire au téléphone
export function phoneRecap(s: QuoteState): string {
  const q = computeQuote(s.formula, s.petHair, s.distance)
  return `${summaryLine(s)} · ${euro(q.total)}${q.partial ? ' hors déplacement' : ''}`
}

// Annonce lecteur d'écran du total
export function liveSummary(s: QuoteState): string {
  const q = computeQuote(s.formula, s.petHair, s.distance)
  const parts = [`formule ${q.formula.name}`]
  if (s.petHair) parts.push('option poils d’animaux')
  if (q.travelFee === null) parts.push(`distance ${distancePart(s.distance).replace('distance ', '')}`)
  else parts.push(q.travelFee === 0 ? 'déplacement inclus' : `déplacement ${euro(q.travelFee)}`)
  return `${q.partial ? 'Total hors déplacement' : 'Total'} : ${euro(q.total)}, ${parts.join(', ')}.`
}
