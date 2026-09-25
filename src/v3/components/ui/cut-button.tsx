import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'icon'

type Common = {
  variant?: Variant
  size?: Size
  block?: boolean
  icon?: ReactNode
  className?: string
  children?: ReactNode
}
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm [--cut:10px]',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-[17px]',
  icon: 'h-12 w-12 [--cut:10px]',
}

// Bouton chanfreiné (coins coupés de Chakra Petch). Le chanfrein est porté par des couches internes :
// un clip-path sur l'élément focalisable mangerait son anneau de focus.
// ::before = anneau 2 px, ::after = écart 2 px couleur de surface, puis remplissage, reflet, contenu.
export function CutButton(props: AsLink | AsButton) {
  const { variant = 'primary', size = 'md', block, icon, className, children, ...rest } = props
  const primary = variant === 'primary'

  const host = cn(
    'group relative isolate inline-flex shrink-0 items-center justify-center font-display font-bold italic uppercase tracking-wide whitespace-nowrap text-white outline-none select-none active:translate-y-px',
    // anneau (géométrie : décalage 4 px → coupe + 4 × (2 − √2))
    'before:pointer-events-none before:absolute before:-inset-1 before:-z-20 before:cut before:[--c:calc(var(--cut)_+_2.34px)] before:opacity-0 focus-visible:before:opacity-100',
    primary ? 'before:bg-white on-red' : 'before:bg-brand-light',
    // écart
    'after:pointer-events-none after:absolute after:-inset-0.5 after:-z-10 after:cut after:[--c:calc(var(--cut)_+_1.17px)] after:bg-[var(--surface)] after:opacity-0 focus-visible:after:opacity-100',
    sizes[size],
    block && 'w-full',
    className,
  )

  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 cut transition-[background-color,--frame] duration-[160ms]',
          primary
            ? 'bg-brand group-hover:bg-brand-light group-active:bg-brand-dark'
            : 'cut-frame [--frame:rgb(255_255_255/.25)] group-hover:bg-white/5 group-hover:[--frame:#fff]',
        )}
      />
      {primary && (
        <span aria-hidden className="pointer-events-none absolute inset-0 cut overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1/3 bg-white/20 [transform:translateX(-130%)_skewX(-10deg)] group-hover:animate-sheen" />
        </span>
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {icon}
        {children}
      </span>
    </>
  )

  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={host}>
        {inner}
      </a>
    )
  }
  const { type = 'button', ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type={type} {...btn} className={host}>
      {inner}
    </button>
  )
}
