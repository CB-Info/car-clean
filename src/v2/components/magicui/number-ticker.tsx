import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'motion/react'

type Props = { value: number; className?: string; decimals?: number }

export function NumberTicker({ value, className, decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { damping: 38, stiffness: 140 })
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })

  useEffect(() => {
    if (inView) mv.set(value)
  }, [inView, value, mv])

  useEffect(
    () =>
      spring.on('change', (v) => {
        if (ref.current)
          ref.current.textContent = v.toLocaleString('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
      }),
    [spring, decimals],
  )

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      0
    </span>
  )
}
