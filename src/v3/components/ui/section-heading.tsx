import { Reveal } from './reveal'
import { cn } from '../../lib/utils'

type Props = { eyebrow: string; title: string; highlight?: string; subtitle?: string; className?: string }

export function SectionHeading({ eyebrow, title, highlight, subtitle, className }: Props) {
  const parts = highlight ? title.split(highlight) : [title]
  return (
    <Reveal className={cn('mx-auto max-w-3xl text-center', className)}>
      <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-light">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-[clamp(1.75rem,8.5vw,2.25rem)] text-balance leading-[1.05] font-bold italic uppercase sm:text-5xl lg:text-6xl">
        {parts[0]}
        {highlight && <span className="text-gradient-red">{highlight}</span>}
        {parts[1]}
      </h2>
      {subtitle && <p className="mt-5 text-base text-mist sm:text-lg">{subtitle}</p>}
    </Reveal>
  )
}
