import { petHairOption } from '../../../data/content'
import { euro } from '../../../lib/pricing'

type Props = { petHair: boolean; setPetHair: (v: boolean) => void }

// Une seule ligne cochable : la case, au biais de l'italique, et le supplément qui s'allume quand elle est cochée.
export function PetOption({ petHair, setPetHair }: Props) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold italic uppercase">Option</h3>
      <label className="mt-4 flex min-h-16 items-center gap-4 px-1.5 transition-colors hover:bg-white/[0.03]">
        <input
          type="checkbox"
          checked={petHair}
          onChange={(e) => setPetHair(e.target.checked)}
          className="pet-check peer h-[22px] w-[22px] shrink-0 -skew-x-10 appearance-none border-2 border-white/40 transition-colors duration-[160ms] checked:border-brand checked:bg-brand hover:border-white/70 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-light"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-base font-semibold">{petHairOption.label}</span>
          <span className="block text-sm text-mist">Matériel dédié pour les poils incrustés dans les tissus et la moquette.</span>
        </span>
        <span className="font-display text-xl font-bold whitespace-nowrap text-mist italic transition-colors peer-checked:text-white">
          +{euro(petHairOption.price)}
        </span>
      </label>
    </div>
  )
}
