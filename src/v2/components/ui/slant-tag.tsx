import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

// Étiquette non interactive au biais de l'italique.
export function SlantTag({ children, variant = 'ink', className }: { children: ReactNode; variant?: 'ink' | 'red'; className?: string }) {
  return (
    <span className={cn('inline-flex h-7 -skew-x-10 items-center px-3', variant === 'ink' ? 'bg-ink/85' : 'bg-brand', className)}>
      <span className="skew-x-10 font-display text-xs font-bold italic uppercase">{children}</span>
    </span>
  )
}
