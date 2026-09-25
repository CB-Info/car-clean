import { useRef, type KeyboardEvent } from 'react'

// Groupe de boutons radio à tabindex itinérant : une seule tabulation pour entrer dans le groupe,
// puis les flèches (avec bouclage), Début et Fin pour choisir.
export function useRovingRadio(count: number, selectedIndex: number, onSelect: (i: number) => void) {
  const refs = useRef<(HTMLElement | null)[]>([])
  const tabStop = selectedIndex >= 0 ? selectedIndex : 0

  const choose = (i: number) => {
    const n = (i + count) % count
    onSelect(n)
    refs.current[n]?.focus()
  }

  return (i: number) => ({
    ref: (el: HTMLElement | null) => {
      refs.current[i] = el
    },
    role: 'radio' as const,
    'aria-checked': i === selectedIndex,
    tabIndex: i === tabStop ? 0 : -1,
    onClick: () => onSelect(i),
    onKeyDown: (e: KeyboardEvent) => {
      const next =
        e.key === 'ArrowRight' || e.key === 'ArrowDown'
          ? i + 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
            ? i - 1
            : e.key === 'Home'
              ? 0
              : e.key === 'End'
                ? count - 1
                : null
      if (next === null) return
      e.preventDefault()
      choose(next)
    },
  })
}
