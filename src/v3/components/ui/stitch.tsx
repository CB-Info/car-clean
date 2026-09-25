import { cn } from '../../lib/utils'

type Props = { vertical?: boolean; double?: boolean; className?: string }

// Surpiqûre rouge : le seul filet coloré de la page. Lignes SVG (pas de dégradé répété).
export function Stitch({ vertical, double, className }: Props) {
  const line = { stroke: 'var(--color-brand-light)', strokeWidth: 1.5, strokeDasharray: '7 5' }
  if (vertical) {
    return (
      <svg aria-hidden focusable="false" className={cn('block h-full w-[2px] overflow-visible', className)}>
        <line x1="1" y1="0" x2="1" y2="100%" {...line} />
      </svg>
    )
  }
  return (
    <svg aria-hidden focusable="false" className={cn('block w-full overflow-visible', double ? 'h-[6px]' : 'h-[2px]', className)}>
      <line x1="0" y1="1" x2="100%" y2="1" {...line} />
      {double && <line x1="0" y1="5" x2="100%" y2="5" {...line} />}
    </svg>
  )
}
