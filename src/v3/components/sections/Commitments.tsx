import { Home, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import { SectionHeading } from '../ui/section-heading'
import { Reveal } from '../ui/reveal'
import { commitments } from '../../data/content'

const iconMap = { shield: ShieldCheck, leaf: Leaf, sparkles: Sparkles, home: Home }

export function Commitments() {
  return (
    <section className="px-4 py-20 sm:py-24">
      <SectionHeading eyebrow="Nos engagements" title="Le soin du détail, à chaque fois" highlight="détail" />
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {commitments.map((c, i) => {
          const Icon = iconMap[c.icon]
          return (
            <Reveal key={c.title} delay={i * 0.06} className="h-full">
              <div className="group h-full rounded-3xl border border-white/10 bg-carbon p-7 transition-colors duration-300 hover:border-brand/50">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-brand/40 bg-brand/10 text-brand transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold italic uppercase">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{c.text}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
