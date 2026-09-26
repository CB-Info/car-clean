import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'
import { euro } from '../../lib/pricing'

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function split(value: number) {
  const cents = Math.round(value * 100)
  const int = String(Math.floor(cents / 100)).split('').map(Number)
  const dec = cents % 100
  return { int, dec: dec ? [Math.floor(dec / 10), dec % 10] : [] }
}
const same = (a: number[], b: number[]) => a.length === b.length && a.every((d, i) => d === b[i])

// Un tambour de chiffres par position. Chaque chiffre ne parcourt que son propre écart (260 ms),
// sans jamais partir de 0 ni passer par des totaux intermédiaires. Chakra Petch n'ayant pas de chiffres
// tabulaires, chaque chiffre occupe une case fixe de var(--digit-w).
function Slot({ digit, ready, leaving }: { digit: number; ready: boolean; leaving?: boolean }) {
  // Seule une case apparue après le premier affichage (nouveau chiffre de tête) fait un fondu d'entrée.
  const [entering] = useState(ready)
  return (
    <span
      className={cn(
        'inline-block h-[1em] w-[var(--digit-w)] text-center leading-none [overflow-y:clip] [overflow-x:visible] transition-opacity duration-[120ms]',
        entering && 'animate-digit-in',
        leaving && 'opacity-0',
      )}
    >
      <span className="odo-drum flex flex-col" style={{ transform: `translateY(${-digit}em)` }}>
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1em]">
            {d}
          </span>
        ))}
      </span>
    </span>
  )
}

export function Odometer({ value, className }: { value: number; className?: string }) {
  const { int, dec } = split(value)
  const [ready, setReady] = useState(false)
  const [prev, setPrev] = useState(int)
  const [ghost, setGhost] = useState<number[] | null>(null)

  // Mémorise les chiffres de tête qui disparaissent (ils s'effacent en 120 ms)
  if (!same(prev, int)) {
    setGhost(int.length < prev.length ? prev : null)
    setPrev(int)
  }

  useEffect(() => {
    // Pas de transition au premier affichage : le bon total est là d'emblée.
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])
  useEffect(() => {
    if (!ghost) return
    const t = setTimeout(() => setGhost(null), 120)
    return () => clearTimeout(t)
  }, [ghost])

  const count = Math.max(int.length, ghost?.length ?? 0)
  const slots = Array.from({ length: count }, (_, j) => count - 1 - j) // positions depuis la droite

  return (
    <span className={cn('odometer inline-flex', ready && 'is-ready', className)}>
      <span className="sr-only">{euro(value)}</span>
      <span
        aria-hidden
        className="inline-flex items-baseline px-[0.15em] [mask-image:linear-gradient(transparent,#000_14%,#000_86%,transparent)]"
      >
        {slots.map((p) => {
          const live = p < int.length
          const digit = live ? int[int.length - 1 - p] : ghost![ghost!.length - 1 - p]
          return <Slot key={`i${p}`} digit={digit} ready={ready} leaving={!live} />
        })}
        {dec.length > 0 && (
          <>
            <span className="inline-block w-[0.26em] text-center">,</span>
            <span className="inline-flex items-baseline text-[0.6em] text-white/70">
              {dec.map((d, i) => (
                <Slot key={`d${i}`} digit={d} ready={ready} />
              ))}
            </span>
          </>
        )}
      </span>
    </span>
  )
}
