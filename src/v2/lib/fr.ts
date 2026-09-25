// Typographie française appliquée aux textes affichés.
// U+00A0 (et non U+202F) : l'espace fine insécable est absente des sous-ensembles latins
// de Chakra Petch et d'Inter, et une police de repli dérangerait les interlignes serrés des titres.
export const NBSP = ' '

export function fr(s: string): string {
  return s
    .replace(/'/g, '’')
    .replace(/(\d) (€|km|%)/g, `$1${NBSP}$2`)
    .replace(/ ([?!:;»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
}
