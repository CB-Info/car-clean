import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Props = {
  children: ReactNode
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  paused?: boolean
  repeat?: number
  duration?: string
}

export function Marquee({ children, className, reverse, pauseOnHover, paused, repeat = 4, duration = '30s' }: Props) {
  return (
    <div
      className={cn('group flex overflow-hidden [--gap:2.5rem] [gap:var(--gap)]', className)}
      style={{ ['--duration' as string]: duration }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={cn(
            'flex shrink-0 animate-marquee items-center justify-around [gap:var(--gap)]',
            reverse && '[animation-direction:reverse]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            paused && '[animation-play-state:paused]',
            // Mouvement réduit : un seul jeu, immobile
            i > 0 && 'motion-reduce:hidden',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
