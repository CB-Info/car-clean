import { Fragment } from 'react'
import { cn } from '../../lib/utils'

type Props = { text: string; highlight?: string[]; className?: string; delay?: number }

// Réservé au titre du hero : révélation rapide mot par mot, jouée au chargement.
// Animation 100 % CSS : elle démarre dès le premier rendu, sans attendre le chargement des fonctionnalités Motion
// (sinon le titre reste invisible et retarde le LCP).
export function WordReveal({ text, highlight = [], className, delay = 0 }: Props) {
  const words = text.split(' ')
  return (
    <h1 className={cn(className)} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span
              className={cn('inline-block animate-word-rise', highlight.includes(w.replace(/[.,!?]/g, '')) && 'text-gradient-red')}
              style={{ animationDelay: `${delay + i * 0.035}s` }}
            >
              {w}
            </span>
          </span>
          {/* Espace hors du bloc inline-block : sinon il est supprimé en fin de bloc */}
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </h1>
  )
}
