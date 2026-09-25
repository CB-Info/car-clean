import { cn } from '../../lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('font-display text-xl font-bold italic tracking-tight uppercase select-none', className)}>
      Car<span className="text-brand">Clean</span>
    </span>
  )
}
