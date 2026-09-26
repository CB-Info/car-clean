import { steps } from '../../data/content'
import { cn } from '../../lib/utils'

// Emplacements de grille de départ : l'ordre est une vraie information, les numéros restent.
export function Process() {
  return (
    <section id="deroule" className="bg-carbon py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-[clamp(2rem,8vw,2.5rem)] leading-[0.98] font-bold tracking-[-0.01em] italic uppercase lg:text-5xl">
          Comment ça se passe
        </h2>

        <ol className="mt-20 grid gap-20 lg:mt-24 lg:grid-cols-3 lg:gap-10">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className={cn(
                // Trait de l'emplacement et ses deux retours (peints au défilement : .slot dans index.css)
                'slot relative pt-10 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-white/50 after:absolute after:top-0 after:right-0 after:h-[18px] after:w-0.5 after:bg-white/50',
                i === 1 && 'lg:mt-12',
                i === 2 && 'lg:mt-24',
              )}
            >
              <span aria-hidden className="slot-tick absolute top-0 left-0 h-[18px] w-0.5 bg-white/50" />
              <span aria-hidden className="absolute -top-[0.3em] left-3 font-display text-[5rem] leading-none font-bold text-brand-light italic lg:text-[7rem]">
                {i + 1}
              </span>
              <h3 className="mt-12 font-display text-2xl font-bold italic uppercase lg:mt-16">
                <span className="sr-only">Étape {i + 1} : </span>
                {s.title}
              </h3>
              <p className="mt-3 max-w-[34ch] text-base leading-[1.6] text-white/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
