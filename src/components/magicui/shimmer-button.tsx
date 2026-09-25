import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; variant?: 'red' | 'ghost' }

// Reflet joué uniquement au survol : aucune animation en continu.
export function ShimmerButton({ children, className, variant = 'red', ...props }: Props) {
  return (
    <a
      {...props}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider italic transition-[transform,box-shadow,background-color,border-color] duration-300 active:scale-[0.97]',
        variant === 'red'
          ? 'bg-brand text-white shadow-[0_10px_40px_-10px_rgba(225,6,0,0.8)] hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-8px_rgba(225,6,0,1)]'
          : 'border border-white/15 bg-white/5 text-white hover:border-white/40 hover:bg-white/10',
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shine" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  )
}
