import { useEffect, useState } from 'react'

// Un seul IntersectionObserver pour plusieurs éléments (aucun écouteur de scroll).
// Renvoie null tant que le premier relevé n'est pas arrivé, pour ne rien afficher à tort au chargement.
export function useVisibleIds(ids: readonly string[], rootMargin: string) {
  const [visible, setVisible] = useState<ReadonlySet<string> | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    const els = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    const io = new IntersectionObserver(
      (entries) =>
        setVisible((prev) => {
          const next = new Set(prev ?? [])
          for (const e of entries) {
            if (e.isIntersecting) next.add(e.target.id)
            else next.delete(e.target.id)
          }
          if (prev && prev.size === next.size && [...next].every((id) => prev.has(id))) return prev
          return next
        }),
      { rootMargin },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key, rootMargin])

  return visible
}
