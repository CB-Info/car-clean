import { Fragment, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Props = { text: string; highlight?: string[]; className?: string; delay?: number }

// Enveloppe seulement la partie qui correspond (« L’intérieur » → seul « intérieur » passe en rouge plein).
function mark(word: string, highlight: string[]): ReactNode {
  for (const h of highlight) {
    const at = word.indexOf(h)
    if (at >= 0) {
      return (
        <>
          {word.slice(0, at)}
          <span className="text-brand-light">{h}</span>
          {word.slice(at + h.length)}
        </>
      )
    }
  }
  return word
}

// La zone de découpe monte de 0,22em (padding compensé par une marge négative : l'interligne ne bouge pas)
// pour ne pas rogner les accents des capitales (É, À, Ù montent à 0,92em au-dessus de la ligne de base).
// Réservé au titre du hero : révélation rapide mot par mot, jouée au chargement.
// Animation 100 % CSS : elle démarre dès le premier rendu, sans attendre le chargement des fonctionnalités Motion
// (sinon le titre reste invisible et retarde le LCP).
export function WordReveal({ text, highlight = [], className, delay = 0 }: Props) {
  const words = text.split(' ')
  return (
    <h1 className={cn(className)} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden className="-mt-[0.22em] -mr-[0.08em] inline-block overflow-hidden pt-[0.22em] pr-[0.08em] pb-[0.12em] align-bottom">
            <span className="inline-block animate-word-rise" style={{ animationDelay: `${delay + i * 0.035}s` }}>
              {mark(w, highlight)}
            </span>
          </span>
          {/* Espace hors du bloc inline-block : sinon il est supprimé en fin de bloc */}
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </h1>
  )
}
