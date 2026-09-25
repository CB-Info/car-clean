import type { MouseEvent, ReactNode } from 'react'
import { m, useMotionTemplate, useMotionValue } from 'motion/react'
import { BorderBeam } from './border-beam'
import { cn } from '../../lib/utils'

type Props = { children: ReactNode; className?: string; glow?: string; beam?: boolean }

export function MagicCard({ children, className, glow = 'rgba(225, 6, 0, 0.28)', beam }: Props) {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }
  const onLeave = () => {
    x.set(-400)
    y.set(-400)
  }

  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${x}px ${y}px, ${glow}, transparent 75%)`
  const border = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgba(255,60,50,0.9), rgba(255,255,255,0.08) 60%)`

  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} className={cn('group relative rounded-3xl p-px', className)}>
      <m.div className="absolute inset-0 rounded-[inherit] bg-white/10" style={{ background: border }} />
      <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-carbon">
        <m.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        <div className="relative h-full">{children}</div>
      </div>
      {/* Au niveau racine pour hériter du border-radius de la carte */}
      {beam && <BorderBeam size={220} duration={9} />}
    </div>
  )
}
