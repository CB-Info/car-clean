import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  ink: 'bg-ink/85 text-white',
  red: 'bg-brand text-white on-red',
  outline: 'border border-white/30 text-white/85',
}

// Étiquette parallélogramme, inclinée à l'angle exact de l'italique (10°). Non interactive.
export function SlantTag({ children, variant = 'ink', className }: { children: ReactNode; variant?: keyof typeof variants; className?: string }) {
  return (
    <span className={cn('slant-tag inline-flex -skew-x-10 px-2.5 py-1', variants[variant], className)}>
      <span className="inline-block skew-x-10 font-display text-[13px] leading-[1.2] font-bold italic uppercase">{children}</span>
    </span>
  )
}
