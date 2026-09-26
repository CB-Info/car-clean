// Typographie française : espace insécable (U+00A0) avant ? ! : ; » et après «,
// entre un nombre et son unité (€, km, %), apostrophe courbe.
// U+00A0 et non U+202F : l'espace fine insécable manque aux sous-ensembles latins de Chakra Petch et d'Inter (mesuré).
export function fr(s: string): string {
  return s
    .replace(/'/g, '’')
    .replace(/ ([?!:;»])/g, ' $1')
    .replace(/« /g, '« ')
    .replace(/(\d) (€|km|%)/g, '$1 $2')
}

// Pour les messages envoyés (SMS, WhatsApp) : espaces ordinaires.
export const plain = (s: string) => s.replace(/[  ]/g, ' ')
