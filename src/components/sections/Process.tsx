import { CalendarCheck, MapPin, Smile, Sparkles } from 'lucide-react'
import { SectionHeading } from '../ui/section-heading'
import { Reveal } from '../ui/reveal'
import { steps } from '../../data/content'

const icons = [CalendarCheck, MapPin, Sparkles, Smile]

export function Process() {
  return (
    <section id="deroule" className="relative bg-carbon px-4 py-20 sm:py-24">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="relative">
        <SectionHeading eyebrow="Comment ça marche" title="4 étapes, zéro effort" highlight="zéro effort" subtitle="De la réservation à la remise des clés, tout est pensé pour vous faire gagner du temps." />
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = icons[i]
            return (
              <Reveal key={s.n} delay={i * 0.06} className="h-full">
                <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink/80 p-7">
                  <span aria-hidden className="pointer-events-none absolute -right-3 -top-6 font-display text-[7rem] leading-none font-bold italic text-transparent [-webkit-text-stroke:1.5px_rgba(225,6,0,0.35)]">
                    {s.n}
                  </span>
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand transition-transform duration-300 group-hover:-rotate-6">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="relative mt-6 font-display text-2xl font-bold italic uppercase">{s.title}</h3>
                  <p className="relative mt-2 text-sm text-white/70">{s.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
