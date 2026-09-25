import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { petHairOption } from '../../../data/content'
import { euro } from '../../../lib/pricing'
import { cn } from '../../../lib/utils'

type Props = { checked: boolean; onChange: (v: boolean) => void }

// Case chanfreinée partagée (option poils, « Je ne connais pas la distance »).
// L'input natif reste le contrôle ; la case dessine l'anneau + écart de focus en couches internes.
export function CutCheckbox({
  checked,
  onChange,
  className,
  children,
  describedBy,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  className?: string
  children: ReactNode
  describedBy?: string
}) {
  return (
    <label className={cn('group flex items-center gap-4 transition-colors duration-[160ms] hover:bg-white/[0.03]', className)}>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-describedby={describedBy} />
      <span
        aria-hidden
        className={cn(
          'relative isolate grid h-6 w-6 shrink-0 place-items-center',
          'before:absolute before:-inset-1 before:-z-20 before:cut before:bg-brand-light before:opacity-0 before:[--c:calc(var(--cut-sm)_+_2.34px)] peer-focus-visible:before:opacity-100',
          'after:absolute after:-inset-0.5 after:-z-10 after:cut after:bg-[var(--surface)] after:opacity-0 after:[--c:calc(var(--cut-sm)_+_1.17px)] peer-focus-visible:after:opacity-100',
        )}
      >
        <span
          className={cn(
            'absolute inset-0 cut cut-frame transition-colors duration-[160ms] [--c:var(--cut-sm)]',
            checked ? 'bg-brand [--frame:transparent]' : '[--frame:rgb(255_255_255/.4)] group-hover:[--frame:rgb(255_255_255/.7)]',
          )}
        />
        <Check className={cn('relative h-4 w-4 text-white transition-opacity duration-[160ms]', checked ? 'opacity-100' : 'opacity-0')} strokeWidth={2.5} />
      </span>
      {children}
    </label>
  )
}

export function PetOption({ checked, onChange }: Props) {
  return (
    <div>
      <h3 className="font-display text-[1.375rem] leading-none font-bold italic uppercase">Option</h3>
      <CutCheckbox checked={checked} onChange={onChange} className="mt-4 min-h-[72px] border-y border-rule px-1 py-3">
        <span className="min-w-0 flex-1">
          <span className="block text-base font-semibold">{petHairOption.label}</span>
          <span className="mt-0.5 block text-sm leading-[1.5] text-mist">{petHairOption.detail}</span>
        </span>
        <span className={cn('shrink-0 font-semibold tabular-nums transition-colors duration-[160ms]', checked ? 'text-brand-light' : 'text-white/70')}>
          +{euro(petHairOption.price)}
        </span>
      </CutCheckbox>
    </div>
  )
}
