// Source unique du contenu du site : modifier ici les tarifs, textes et contacts.

export type FormulaId = 'basic' | 'gold' | 'platinum'

export type Formula = {
  id: FormulaId
  name: string
  price: number
  tagline: string
  features: string[]
  highlight?: string
}

export const formulas: Formula[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 60,
    tagline: "L'entretien express",
    features: [
      'Aspiration de la moquette',
      'Aspiration tapis',
      'Dépoussiérage des plastiques',
      'Nettoyage vitres intérieur & extérieur',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 90,
    tagline: 'Le grand rafraîchissement',
    features: [
      'Aspiration de la moquette',
      'Shampouinage tapis',
      'Dépoussiérage & nettoyage des plastiques',
      'Shampouinage des sièges',
      'Nettoyage des portes et du coffre',
      'Nettoyage vitres intérieur & extérieur',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 120,
    tagline: 'Comme sortie de concession',
    highlight: 'Le + complet',
    features: [
      'Aspiration de la moquette',
      'Shampouinage tapis',
      'Dépoussiérage et nettoyage des plastiques',
      'Shampouinage des sièges et de la moquette',
      'Nettoyage des portes et du coffre',
      'Nettoyage vitres intérieures & extérieur',
      'Traitement cuir / alcantara si présent',
      'Désodorisant de finition',
    ],
  },
]

export const petHairOption = { label: "Poils d'animaux", price: 15 }

export const travel = {
  includedKm: 10,
  brackets: [
    { upTo: 20, fee: 5 },
    { upTo: 30, fee: 10 },
    { upTo: 40, fee: 15 },
    { upTo: 50, fee: 20 },
  ],
  perKmBeyond: 0.5,
}

export const contact = {
  phoneDisplay: '06 34 53 10 41',
  phoneIntl: '+33634531041',
  whatsapp: '33634531041',
  tiktok: { handle: 'car_clean01.38.69', url: 'https://www.tiktok.com/@car_clean01.38.69' },
  instagram: { handle: '@carclean01.38.69', url: 'https://www.instagram.com/carclean01.38.69' },
  // Déduit des identifiants réseaux (01 · 38 · 69) : à confirmer avec le client.
  zone: 'Ain · Isère · Rhône',
}

export const images = {
  hero: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=1600&q=65&auto=format&fit=crop',
  beforeAfter: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1400&q=65&auto=format&fit=crop',
  foam: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=900&q=65&auto=format&fit=crop',
  spray: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=900&q=65&auto=format&fit=crop',
}

export const commitments = [
  { icon: 'shield', title: 'Produits professionnels', text: 'Des produits adaptés à chaque surface, efficaces et sans agresser les matériaux.' },
  { icon: 'leaf', title: 'Respect des matériaux', text: 'Tissu, cuir, alcantara, plastiques : chaque matière est traitée avec la bonne méthode.' },
  { icon: 'sparkles', title: 'Résultat impeccable', text: 'On ne repart pas tant que votre habitacle ne brille pas. Le souci du détail, partout.' },
  { icon: 'home', title: 'À domicile ou au travail', text: 'On vient à vous : devant chez vous ou sur le parking du bureau. Zéro trajet, zéro attente.' },
] as const

export const steps = [
  { n: '01', title: 'Vous réservez', text: 'Un appel, un SMS ou un message WhatsApp. On fixe ensemble le créneau et la formule.' },
  { n: '02', title: 'On vient à vous', text: 'À domicile ou au travail, avec tout le matériel pro. Déplacement inclus jusqu’à 10 km.' },
  { n: '03', title: 'On sublime', text: 'Aspiration, shampouinage, plastiques, vitres, cuir : votre intérieur retrouve son éclat.' },
  { n: '04', title: 'Vous profitez', text: 'Vous récupérez une voiture propre, fraîche et qui sent bon. Sans avoir bougé.' },
]

// Réponses à valider avec le client avant la mise en ligne.
export const faq = [
  {
    q: 'Où intervenez-vous ?',
    a: `Directement chez vous ou sur votre lieu de travail. Le déplacement est inclus jusqu’à ${travel.includedKm} km, puis un petit forfait s’applique selon la distance (voir le simulateur).`,
  },
  {
    q: 'Mon véhicule est très sale, c’est possible ?',
    a: 'Bien sûr ! Pour les véhicules très sales, envoyez-nous quelques photos par SMS, WhatsApp ou Instagram et on vous fait un devis sur mesure.',
  },
  {
    q: 'J’ai un chien, les poils partent vraiment ?',
    a: `Oui, avec l’option poils d’animaux (+${petHairOption.price} €) on utilise un matériel dédié pour déloger les poils incrustés dans les tissus et la moquette.`,
  },
  {
    q: 'Quelle formule choisir ?',
    a: 'Basic pour un entretien régulier, Gold pour un vrai rafraîchissement avec shampouinage des sièges, Platinum pour un résultat complet avec traitement du cuir et désodorisant.',
  },
  {
    q: 'Comment réserver ?',
    a: `Par téléphone au ${contact.phoneDisplay}, par SMS, WhatsApp ou en message privé sur Instagram / TikTok. Réponse rapide garantie.`,
  },
]
