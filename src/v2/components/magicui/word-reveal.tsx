import { Fragment, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Props = { text: string; highlight?: string[]; className?: string; delay?: number }

// Colore en rouge plein la partie du mot qui correspond (« L’intérieur » : seul « intérieur » est rouge).
function paint(word: string, highlight: string[]): ReactNode {
  const match = highlight.find((h) => word.includes(h))
  if (!match) return word
  const at = word.indexOf(match)
  return (
    <>
      {word.slice(0, at)}
      <span className="text-brand-light">{match}</span>
      {word.slice(at + match.length)}
    </>
  )
}

// Réservé au titre du hero : révélation rapide mot par mot, jouée au chargement.
// Animation 100 % CSS : elle démarre dès le premier rendu, sans attendre le chargement des fonctionnalités Motion
// (sinon le titre reste invisible et retarde le LCP).
export function WordReveal({ text, highlight = [], className, delay = 0 }: Props) {
  const words = text.split(' ')
  return (
    <h1 className={cn(className)} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden className="-mt-[0.18em] inline-block overflow-hidden pt-[0.18em] pb-[0.12em] align-bottom">
            <span className="inline-block animate-word-rise" style={{ animationDelay: `${delay + i * 0.035}s` }}>
              {paint(w, highlight)}
            </span>
          </span>
          {/* Espace hors du bloc inline-block : sinon il est supprimé en fin de bloc */}
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </h1>
  )
}
