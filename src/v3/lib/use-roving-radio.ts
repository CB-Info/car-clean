import { useRef, type KeyboardEvent } from 'react'

// Groupe radio accessible : tabindex itinérant, flèches (avec bouclage), Début / Fin.
export function useRovingRadio(count: number, selected: number, onSelect: (i: number) => void) {
  const refs = useRef<(HTMLElement | null)[]>([])
  const tabStop = selected >= 0 && selected < count ? selected : 0

  const move = (i: number) => {
    const n = (i + count) % count
    onSelect(n)
    refs.current[n]?.focus()
  }

  return (i: number) => ({
    ref: (el: HTMLElement | null) => {
      refs.current[i] = el
    },
    role: 'radio' as const,
    'aria-checked': selected === i,
    tabIndex: i === tabStop ? 0 : -1,
    onClick: () => onSelect(i),
    onKeyDown: (e: KeyboardEvent) => {
      const k = e.key
      if (k === 'ArrowRight' || k === 'ArrowDown') move(i + 1)
      else if (k === 'ArrowLeft' || k === 'ArrowUp') move(i - 1)
      else if (k === 'Home') move(0)
      else if (k === 'End') move(count - 1)
      else return
      e.preventDefault()
    },
  })
}
