import { steps } from '../../data/content'
import { Stitch } from '../ui/stitch'

// Déroulé : une couture, trois chiffres. Bande carbone au bord supérieur incliné (écho des sangles).
export function Process() {
  return (
    <section
      id="deroule"
      className="bg-carbon pt-[calc(var(--tilt-rise)+5rem)] pb-24 [--surface:var(--color-carbon)] [clip-path:polygon(0_var(--tilt-rise),100%_0,100%_100%,0_100%)]"
    >
      <div className="mx-auto max-w-[75rem] px-4 sm:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-6">
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.04] font-bold tracking-[-0.01em] italic uppercase">Comment ça se passe</h2>
            <p className="mt-4 text-base text-mist">Trois étapes, sans vous déplacer.</p>
          </div>
        </div>

        <ol className="relative mt-10 space-y-10 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:space-y-0">
          {/* La couture : horizontale sur desktop (à mi-hauteur des chiffres), verticale sur mobile */}
          <Stitch className="absolute inset-x-0 top-[3.1rem] hidden lg:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[56px_1fr] gap-x-4 lg:col-span-4 lg:block">
              {i < steps.length - 1 && (
                <Stitch vertical className="absolute top-[3.25rem] left-[27px] h-[calc(100%-1rem)] lg:hidden" />
              )}
              <span className="relative inline-block w-14 self-start bg-carbon pb-1 text-center font-display text-[3.5rem] leading-none font-bold italic lg:w-auto lg:pr-4 lg:text-left lg:text-[7rem]">
                <span className="sr-only">Étape </span>
                {i + 1}
              </span>
              <div className="lg:mt-6 lg:pr-6">
                <h3 className="pt-2 font-display text-[1.375rem] leading-[1.05] font-bold italic uppercase lg:pt-0">{s.title}</h3>
                <p className="mt-2 max-w-[32ch] text-base leading-[1.6] text-mist">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
