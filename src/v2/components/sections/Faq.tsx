import { useState } from 'react'
import { Plus } from 'lucide-react'
import { contact, faq } from '../../data/content'
import { telLink, whatsappLink } from '../../lib/links'
import { cn } from '../../lib/utils'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <h2 className="font-display text-[clamp(2rem,8vw,2.5rem)] leading-[0.98] font-bold tracking-[-0.01em] italic uppercase lg:text-5xl">
            Questions pratiques
          </h2>
          <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-white/70">
            Une autre question{' '}? Appelez le{' '}
            <a href={telLink} className="text-link whitespace-nowrap text-white tabular-nums">
              {contact.phoneDisplay}
            </a>{' '}
            ou{' '}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="text-link text-white">
              écrivez-nous sur WhatsApp
            </a>
            .
          </p>
        </div>

        <ul className="mt-10 border-b border-line lg:col-span-8 lg:mt-0">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={item.q} className={cn('border-t transition-colors duration-200', isOpen ? 'border-brand' : 'border-line')}>
                <h3>
                  <button
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    className={cn(
                      'group flex min-h-16 w-full items-start justify-between gap-6 py-5 text-left text-[19px] leading-snug font-semibold text-pretty transition-colors hover:text-white',
                      isOpen ? 'text-white' : 'text-white/90',
                    )}
                  >
                    {item.q}
                    <Plus
                      aria-hidden
                      className={cn(
                        'mt-0.5 h-5 w-5 shrink-0 transition-transform duration-[220ms] ease-out-expo',
                        isOpen ? 'rotate-45 text-brand-light' : 'text-white/60 group-hover:text-white',
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  inert={!isOpen}
                  className={cn('grid transition-[grid-template-rows] duration-[220ms] ease-out-expo', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-6 text-base leading-[1.65] text-white/70">{item.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
