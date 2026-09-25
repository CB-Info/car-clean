import { m } from 'motion/react'
import { cn } from '../../lib/utils'

type Props = { text: string; highlight?: string[]; className?: string; delay?: number }

// Réservé au titre du hero : révélation rapide mot par mot, jouée au chargement.
export function WordReveal({ text, highlight = [], className, delay = 0 }: Props) {
  const words = text.split(' ')
  return (
    <m.h1 className={cn(className)} initial="hidden" animate="show" transition={{ staggerChildren: 0.035, delayChildren: delay }} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <m.span
            className={cn('inline-block', highlight.includes(w.replace(/[.,!?]/g, '')) && 'text-gradient-red')}
            variants={{ hidden: { y: '100%' }, show: { y: '0%', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
          >
            {w}
          </m.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </m.h1>
  )
}
