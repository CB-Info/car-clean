import type { ReactNode } from 'react'
import { m } from 'motion/react'

type Props = { children: ReactNode; className?: string; delay?: number }

// Apparition unique au scroll (opacity + translate : propriétés composées par le GPU).
export function Reveal({ children, className, delay = 0 }: Props) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}
