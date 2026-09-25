import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Plus } from 'lucide-react'
import { SectionHeading } from '../ui/section-heading'
import { faq } from '../../data/content'
import { cn } from '../../lib/utils'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="px-4 py-20 sm:py-24">
      <SectionHeading eyebrow="FAQ" title="Vos questions, nos réponses" highlight="réponses" />
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {faq.map((item, i) => {
          const isOpen = open === i
          return (
            <div
              key={item.q}
              className={cn('overflow-hidden rounded-2xl border transition-colors', isOpen ? 'border-brand/50 bg-brand/[0.06]' : 'border-white/10 bg-carbon/70')}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
              >
                <span className="font-display text-lg font-semibold sm:text-xl">{item.q}</span>
                <m.span animate={{ rotate: isOpen ? 45 : 0 }} className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full', isOpen ? 'bg-brand' : 'bg-white/10')}>
                  <Plus className="h-5 w-5" />
                </m.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-5 pb-6 text-white/70 sm:px-6">{item.a}</p>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
