import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'ghost' | 'onRed' | 'onRedGhost'
type Size = 'md' | 'lg' | 'icon'

type Common = { variant?: Variant; size?: Size; block?: boolean; arrow?: boolean; children: ReactNode; className?: string }
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }

// Le biais (angle de l'italique, −10°) est porté par l'élément focalisable lui-même :
// bordure et contour de focus suivent le parallélogramme. Le contenu est redressé.
const base =
  'slant-control group relative inline-flex -skew-x-10 items-center justify-center overflow-hidden font-display font-bold italic uppercase tracking-wide whitespace-nowrap transition-[translate,border-color] duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-3 ' +
  // Survol : un aplat qui entre par la gauche, au même angle
  'before:absolute before:inset-0 before:-translate-x-[101%] before:transition-transform before:duration-[240ms] before:ease-out-expo group-hover:before:translate-x-0 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:before:hidden'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white before:bg-brand-light focus-visible:outline-white',
  ghost: 'border border-white/25 text-white before:bg-white/8 hover:border-white/60 focus-visible:outline-brand-light',
  onRed: 'bg-ink text-white before:bg-[#1c1c20] focus-visible:outline-white',
  onRedGhost: 'border border-white/70 text-white before:bg-white/12 focus-visible:outline-white',
}

const sizes: Record<Size, string> = {
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
  icon: 'h-11 w-11 shrink-0 px-0',
}

export function SlantButton(props: AsLink | AsButton) {
  const { variant = 'primary', size = 'md', block, arrow, children, className, ...rest } = props
  const cls = cn(base, variants[variant], sizes[size], block && 'mx-1.5 flex w-[calc(100%-0.75rem)]', className)
  const inner = (
    <span className="relative z-10 inline-flex skew-x-10 items-center gap-2">
      {children}
      {arrow && <ArrowRight aria-hidden className="h-5 w-5 transition-transform duration-[240ms] ease-out-expo group-hover:translate-x-[3px]" />}
    </span>
  )
  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={cls}>
      {inner}
    </button>
  )
}
