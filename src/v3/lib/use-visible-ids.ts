import { useEffect, useState } from 'react'

// Un seul IntersectionObserver ; aucun écouteur de scroll.
export function useVisibleIds(ids: string[], rootMargin = '0px'): Set<string> {
  const [visible, setVisible] = useState<Set<string>>(() => new Set())
  const key = ids.join('|')

  useEffect(() => {
    const els = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev)
          for (const e of entries) {
            if (e.isIntersecting) next.add(e.target.id)
            else next.delete(e.target.id)
          }
          if (next.size === prev.size && [...next].every((id) => prev.has(id))) return prev
          return next
        })
      },
      { rootMargin },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key, rootMargin])

  return visible
}
