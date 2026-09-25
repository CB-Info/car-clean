type Props = { size?: number; duration?: number; colorFrom?: string; colorTo?: string; borderWidth?: number }

// Version 100 % CSS (pas de JS par frame).
// L'anneau est dessiné dans le padding (masque "exclude") : on peut ainsi appliquer overflow-hidden,
// qui empêche le faisceau de déborder de la carte et d'élargir la page sur mobile.
export function BorderBeam({ size = 160, duration = 8, colorFrom = '#ff2a1f', colorTo = '#ffffff', borderWidth = 2 }: Props) {
  return (
    <div aria-hidden className="beam-ring pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" style={{ padding: borderWidth }}>
      <div
        className="absolute aspect-square animate-beam"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          offsetDistance: '0%',
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          ['--beam-duration' as string]: `${duration}s`,
        }}
      />
    </div>
  )
}
