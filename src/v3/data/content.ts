// Source unique du contenu du site : modifier ici les tarifs, textes et contacts.
import { fr } from '../lib/fr'

export type FormulaId = 'basic' | 'gold' | 'platinum'

export type Formula = {
  id: FormulaId
  name: string
  price: number
  tagline: string
}

// Accroches tirées des conseils de la FAQ V1 : aucune nouvelle promesse.
export const formulas: Formula[] = [
  { id: 'basic', name: 'Basic', price: 60, tagline: fr('Entretien régulier') },
  { id: 'gold', name: 'Gold', price: 90, tagline: fr('Le grand rafraîchissement') },
  { id: 'platinum', name: 'Platinum', price: 120, tagline: fr('Le soin complet, cuir compris') },
]

export type Cell = { text?: string; check?: true } | null

// Mêmes prestations que V1 — à valider avec le client, aucune prestation ajoutée
export const serviceMatrix: { id: string; label: string; note?: string; cells: Record<FormulaId, Cell> }[] = [
  { id: 'moquette', label: 'Moquette', cells: { basic: { text: 'Aspiration' }, gold: { text: 'Aspiration' }, platinum: { text: 'Aspiration + shampouinage' } } },
  // « Tapis de sol » (V1 : « tapis ») — à confirmer avec le client
  { id: 'tapis', label: 'Tapis de sol', cells: { basic: { text: 'Aspiration' }, gold: { text: 'Shampouinage' }, platinum: { text: 'Shampouinage' } } },
  { id: 'plastiques', label: 'Plastiques', cells: { basic: { text: 'Dépoussiérage' }, gold: { text: 'Dépoussiérage + nettoyage' }, platinum: { text: 'Dépoussiérage + nettoyage' } } },
  { id: 'sieges', label: 'Sièges', cells: { basic: null, gold: { text: 'Shampouinage' }, platinum: { text: 'Shampouinage' } } },
  { id: 'portes', label: 'Portes et coffre', cells: { basic: null, gold: { text: 'Nettoyage' }, platinum: { text: 'Nettoyage' } } },
  { id: 'vitres', label: 'Vitres', note: 'dedans et dehors', cells: { basic: { check: true }, gold: { check: true }, platinum: { check: true } } },
  { id: 'cuir', label: 'Cuir / alcantara', note: 'si présent', cells: { basic: null, gold: null, platinum: { text: 'Traitement' } } },
  { id: 'deso', label: 'Désodorisant de finition', cells: { basic: null, gold: null, platinum: { check: true } } },
]

export const petHairOption = {
  label: fr('Poils d’animaux'),
  price: 15,
  detail: fr('Matériel dédié pour déloger les poils incrustés dans les tissus et la moquette.'),
}

export const travel = {
  includedKm: 10,
  brackets: [
    { upTo: 20, fee: 5 },
    { upTo: 30, fee: 10 },
    { upTo: 40, fee: 15 },
    { upTo: 50, fee: 20 },
  ],
  perKmBeyond: 0.5,
  maxKm: 300,
  origin: null as string | null, // ville de départ : à fournir par le client
}

export const contact = {
  // Numéro fictif : à remplacer par celui du client.
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

// Sangle 1 : les vraies prestations, pas des adjectifs.
export const strapItems = [
  'Aspiration',
  'Shampouinage des sièges',
  'Plastiques',
  'Vitres dedans et dehors',
  'Portes et coffre',
  'Cuir et alcantara',
  fr('Poils d’animaux'),
  'Désodorisant',
]

// Le seul fait concret de l'ancienne section « Engagements » (V1).
export const materialsNote = fr(
  'Tissu, cuir, alcantara, plastiques : chaque matière est traitée avec la bonne méthode. Tout le matériel est fourni.',
)

export const steps = [
  {
    title: 'Vous écrivez ou appelez',
    text: fr('WhatsApp, SMS ou téléphone : dites-nous la formule, l’adresse et les jours qui vous arrangent.'),
  },
  { title: 'On fixe le rendez-vous', text: fr('On convient ensemble du jour, de l’heure et de la formule.') },
  { title: 'On nettoie sur place', text: fr('Devant chez vous ou sur le parking du bureau, avec tout le matériel.') },
]

const firstFee = travel.brackets[0].fee
const lastBracket = travel.brackets[travel.brackets.length - 1]
const perKm = travel.perKmBeyond.toLocaleString('fr-FR', { minimumFractionDigits: 2 })

// Réponses à valider avec le client avant la mise en ligne.
export const faq: { q: string; a: string; compare?: true }[] = [
  {
    q: fr('Où intervenez-vous ?'),
    a: fr(
      `Dans l’Ain, l’Isère et le Rhône, devant chez vous ou sur votre lieu de travail. Déplacement inclus jusqu’à ${travel.includedKm} km, puis de ${firstFee} à ${lastBracket.fee} € selon la distance, et ${perKm} € par km au-delà de ${lastBracket.upTo} km.`,
    ),
  },
  {
    q: fr('Vous nettoyez aussi l’extérieur ?'),
    // à confirmer avec le client
    a: fr('CarClean s’occupe de l’intérieur. Les vitres sont faites côté intérieur et côté extérieur.'),
  },
  {
    q: fr('Mon véhicule est très sale, c’est possible ?'),
    a: fr('Oui : envoyez quelques photos par SMS ou WhatsApp, on vous répond avec un devis.'),
  },
  {
    q: fr('J’ai un chien, les poils partent vraiment ?'),
    a: fr(
      `Oui, avec l’option poils d’animaux (+${petHairOption.price} €) on utilise un matériel dédié pour déloger les poils incrustés dans les tissus et la moquette.`,
    ),
  },
  {
    q: fr('Quelle formule choisir ?'),
    a: fr(
      'Basic pour l’entretien régulier, Gold pour un vrai rafraîchissement avec shampouinage des sièges, Platinum pour le soin complet avec traitement du cuir et désodorisant.',
    ),
    compare: true,
  },
  {
    q: fr('Comment réserver ?'),
    a: fr(`Par téléphone au ${contact.phoneDisplay}, par SMS ou sur WhatsApp.`),
  },
]

// Questions pratiques à faire trancher par le client (non affichées tant qu'elles n'ont pas de réponse vérifiée).
export const faqToConfirm = [
  'Durée',
  'Présence nécessaire ?',
  'Eau / électricité',
  'Paiement',
  'Taille du véhicule (SUV, utilitaire)',
  'Jours et horaires',
  'Annulation',
]

// Mentions légales : champs à fournir par le client, aucune valeur inventée.
export const legal = '[raison sociale] · SIRET [à fournir] · [adresse à fournir] · Hébergeur [à fournir]'
