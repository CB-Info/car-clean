import { useState } from 'react'
import { euro } from '../../lib/pricing'
import { usePrefersReducedMotion } from '../../lib/use-reduced-motion'
import { cn } from '../../lib/utils'

type Parts = { int: string; cents: string | null }

function parts(value: number): Parts {
  const c = Math.round(value * 100)
  const cents = c % 100
  return { int: String(Math.floor(c / 100)), cents: cents ? String(cents).padStart(2, '0') : null }
}

type Dir = 'up' | 'down'
const inCls: Record<Dir, string> = { up: 'animate-digit-in-up', down: 'animate-digit-in-down' }
const outCls: Record<Dir, string> = { up: 'animate-digit-out-up', down: 'animate-digit-out-down' }

// Case à chiffre de largeur fixe (Chakra Petch n'a pas de chiffres tabulaires).
// Un chiffre invisible dans le flux donne la ligne de base ; la couche animée est rognée en hauteur seulement,
// pour garder le débord de l'italique.
function Slot({ digit, old, dir, version, animate }: { digit: string; old?: string; dir: Dir; version: number; animate: boolean }) {
  const changed = animate && old !== digit
  return (
    <span className="relative inline-block w-[var(--digit)] text-center">
      <span className="invisible">{digit}</span>
      <span className="absolute inset-0 [overflow-x:visible] [overflow-y:clip]">
        {changed && old !== undefined && (
          <span key={`o${version}`} className={cn('absolute inset-0', outCls[dir])}>
            {old}
          </span>
        )}
        <span key={`n${version}`} className={cn('block', changed && inCls[dir])}>
          {digit}
        </span>
      </span>
    </span>
  )
}

// Total en « panneau des stands » : seuls les chiffres qui changent basculent, vers le haut si le prix monte,
// vers le bas s'il baisse. Juste dès le premier rendu, sans compteur ni valeur intermédiaire.
export function RollingNumber({ value, className }: { value: number; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [state, setState] = useState<{ value: number; prev: number | null; version: number }>({ value, prev: null, version: 0 })
  if (state.value !== value) setState({ value, prev: state.value, version: state.version + 1 })

  const cur = parts(state.value)
  const old = state.prev === null ? null : parts(state.prev)
  const animate = old !== null && !reduced
  const dir: Dir = state.prev !== null && state.value < state.prev ? 'down' : 'up'
  const len = cur.int.length

  return (
    <span className={cn('inline-block whitespace-nowrap leading-none', className)}>
      <span aria-hidden>
        {cur.int.split('').map((d, idx) => {
          const fromRight = len - 1 - idx
          const o = old ? old.int[old.int.length - 1 - fromRight] : undefined
          // Clé depuis la droite : l'unité ne se décale jamais quand 90 devient 110.
          return <Slot key={`i${fromRight}`} digit={d} old={o} dir={dir} version={state.version} animate={animate} />
        })}
        {cur.cents && (
          <span className="inline-block translate-y-[0.1em] align-top text-[0.55em]">
            ,
            {cur.cents.split('').map((d, idx) => (
              <Slot key={`c${idx}`} digit={d} old={old?.cents?.[idx]} dir={dir} version={state.version} animate={animate} />
            ))}
          </span>
        )}
        <span className="ml-[0.08em] text-[0.45em] text-brand-light">€</span>
      </span>
      <span className="sr-only">{euro(value)}</span>
    </span>
  )
}
