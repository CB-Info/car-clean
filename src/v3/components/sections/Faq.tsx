import type { MouseEvent } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { contact, faq } from '../../data/content'
import { fr } from '../../lib/fr'
import { telLink } from '../../lib/links'

export function Faq({ onCompare }: { onCompare: () => void }) {
  const compare = (e: MouseEvent) => {
    e.preventDefault()
    onCompare()
  }
  return (
    <section id="faq" className="bg-ink py-24 [--surface:var(--color-ink)]">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.04] font-bold tracking-[-0.01em] italic uppercase">Questions pratiques</h2>
          <p className="mt-4 text-base text-mist">
            {fr('Une autre question ? Appelez le')}{' '}
            <a href={telLink} className="link whitespace-nowrap text-white tabular-nums hover:text-brand-light">
              {contact.phoneDisplay}
            </a>
            .
          </p>
        </div>

        <div className="mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
          {faq.map((item, i) => (
            <details key={item.q} name="faq" open={i === 0} className="faq-item group border-t border-rule last:border-b">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-left text-lg font-semibold text-white/85 transition-colors hover:text-white group-open:text-white">
                {item.q}
                <Plus
                  aria-hidden
                  className="h-5 w-5 shrink-0 transition-[rotate,color] duration-[240ms] ease-out-expo group-open:rotate-45 group-open:text-brand-light"
                  strokeWidth={2}
                />
              </summary>
              <div className="pb-6">
                <p className="max-w-[62ch] text-base leading-[1.6] text-white/70">{item.a}</p>
                {item.compare && (
                  <a href="#tarif" onClick={compare} className="link mt-3 inline-flex items-center gap-2 py-1 text-base font-semibold text-white hover:text-brand-light">
                    Comparer dans le tableau
                    <ArrowRight aria-hidden className="h-[18px] w-[18px]" />
                  </a>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
