// Source unique du contenu du site : modifier ici les tarifs, textes et contacts.
import { fr } from '../lib/fr'

export type FormulaId = 'basic' | 'gold' | 'platinum'

export type Formula = {
  id: FormulaId
  name: string
  price: number
  // Formulations reprises des conseils de la FAQ V1 : à valider avec le client.
  tagline: string
}

export const formulas: Formula[] = [
  { id: 'basic', name: 'Basic', price: 60, tagline: fr('Pour l’entretien régulier') },
  { id: 'gold', name: 'Gold', price: 90, tagline: fr('Quand sièges et tapis ont besoin d’un shampouinage') },
  { id: 'platinum', name: 'Platinum', price: 120, tagline: fr('La totale : cuir, alcantara et désodorisant') },
]

export type Cell = string | true | null

// Mêmes prestations que V1, formulations harmonisées — à valider avec le client
// Ordre des lignes : prestations communes d'abord, pour que les tirets dessinent un escalier.
export const serviceRows: { id: string; label: string; note?: string; cells: Record<FormulaId, Cell> }[] = [
  { id: 'vitres', label: 'Vitres', note: 'intérieur et extérieur', cells: { basic: true, gold: true, platinum: true } },
  { id: 'moquette', label: 'Moquette', cells: { basic: 'Aspiration', gold: 'Aspiration', platinum: 'Aspiration + shampouinage' } },
  { id: 'tapis', label: 'Tapis de sol', cells: { basic: 'Aspiration', gold: 'Shampouinage', platinum: 'Shampouinage' } }, // « tapis de sol » à confirmer
  { id: 'plastiques', label: 'Plastiques', cells: { basic: 'Dépoussiérage', gold: 'Dépoussiérage + nettoyage', platinum: 'Dépoussiérage + nettoyage' } },
  { id: 'sieges', label: 'Sièges', cells: { basic: null, gold: 'Shampouinage', platinum: 'Shampouinage' } },
  { id: 'portes', label: 'Portes et coffre', cells: { basic: null, gold: 'Nettoyage', platinum: 'Nettoyage' } },
  { id: 'cuir', label: 'Cuir / alcantara', note: 'si présent', cells: { basic: null, gold: null, platinum: 'Traitement' } },
  { id: 'deso', label: 'Désodorisant de finition', cells: { basic: null, gold: null, platinum: true } },
]

export const petHairOption = { label: fr('Poils d’animaux'), price: 15 }

export const travel = {
  includedKm: 10,
  brackets: [
    { upTo: 20, fee: 5 },
    { upTo: 30, fee: 10 },
    { upTo: 40, fee: 15 },
    { upTo: 50, fee: 20 },
  ],
  perKmBeyond: 0.5,
  origin: null as string | null, // ville de départ des déplacements : à fournir par le client
}

export const contact = {
  // Numéro fictif : à remplacer par celui du client. Espaces insécables : le numéro ne se coupe jamais.
  phoneDisplay: '06 06 06 06 06',
  phoneIntl: '+33606060606',
  whatsapp: '33606060606',
  // À confirmer avec le client.
  zone: 'Ain · Isère · Rhône',
}

export const images = {
  hero: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=1600&q=65&auto=format&fit=crop',
  beforeAfter: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1400&q=65&auto=format&fit=crop',
}

export const marqueeItems = [
  'Aspiration',
  'Shampouinage des sièges',
  'Plastiques',
  'Vitres dedans et dehors',
  'Portes et coffre',
  'Cuir et alcantara',
  fr('Poils d’animaux'),
  'Désodorisant',
]

// Repris des engagements et du sous-titre des formules de la V1.
export const materialsNote = fr('Produits adaptés à chaque matière : tissu, cuir, alcantara, plastiques. Tout le matériel est fourni.')

export const steps = [
  {
    title: 'Vous écrivez ou appelez',
    text: fr(
      'Par WhatsApp, SMS ou téléphone. Le message préparé dans le tarif contient déjà la formule, l’option, la distance et le total : ajoutez l’adresse, le véhicule et vos jours possibles.',
    ),
  },
  { title: 'On fixe le créneau', text: fr('On convient ensemble du jour et de l’heure, et on confirme la formule.') },
  {
    title: 'On nettoie sur place',
    text: fr(`Chez vous ou sur votre lieu de travail, avec tout le matériel. Déplacement inclus jusqu’à ${travel.includedKm} km.`),
  },
]

const lastBracket = travel.brackets[travel.brackets.length - 1]
const perKm = travel.perKmBeyond.toLocaleString('fr-FR', { minimumFractionDigits: 2 })

// Réponses à valider avec le client avant la mise en ligne.
export const faq = [
  {
    q: fr('Où intervenez-vous ?'),
    a: fr(
      `Dans l’Ain, l’Isère et le Rhône, chez vous ou sur votre lieu de travail. Déplacement inclus jusqu’à ${travel.includedKm} km, puis de ${travel.brackets[0].fee} à ${lastBracket.fee} € selon la distance, et ${perKm} € par km au-delà de ${lastBracket.upTo} km.`,
    ),
  },
  {
    q: fr('Et l’extérieur de la voiture ?'),
    // à valider avec le client
    a: fr('Nos formules concernent l’intérieur du véhicule. Les vitres sont nettoyées côté intérieur et côté extérieur.'),
  },
  {
    q: fr('Mon véhicule est très sale, c’est possible ?'),
    a: fr('Oui. Envoyez quelques photos par SMS ou WhatsApp : on vous répond avec un devis.'),
  },
  {
    q: fr('J’ai un chien, les poils partent vraiment ?'),
    a: fr(
      `Oui, avec l’option poils d’animaux (+${petHairOption.price} €), on utilise un matériel dédié pour déloger les poils incrustés dans les tissus et la moquette.`,
    ),
  },
  {
    q: fr('Quelle formule choisir ?'),
    a: fr(
      'Basic pour un entretien régulier, Gold pour un vrai rafraîchissement avec shampouinage des sièges, Platinum pour un résultat complet avec traitement du cuir et désodorisant.',
    ),
  },
  {
    q: fr('Comment réserver ?'),
    a: fr(`Par téléphone au ${contact.phoneDisplay}, par SMS ou sur WhatsApp. Le tarif ci-dessus prépare le message pour vous.`),
  },
]

// Questions pratiques à faire compléter par le client (non affichées tant qu'elles ne sont pas renseignées).
export const faqToConfirm = [
  'Durée d’une intervention',
  'Faut-il être présent ?',
  'Besoin d’eau ou d’électricité ?',
  'Moyens de paiement',
  'Tailles de véhicules acceptées (SUV, utilitaire)',
  'Jours et horaires',
  'Annulation',
]

export const legal = fr('Informations légales à compléter par CarClean : raison sociale, SIRET, adresse, hébergeur du site.')
