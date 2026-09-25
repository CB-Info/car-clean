import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { animate, m, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'
import { Camera, ChevronsLeftRight } from 'lucide-react'
import { SectionHeading } from '../ui/section-heading'
import { ShimmerButton } from '../magicui/shimmer-button'
import { images } from '../../data/content'
import { whatsappLink } from '../../lib/links'
import { unsplashSrcSet } from '../../lib/utils'

const imgProps = {
  src: images.beforeAfter,
  srcSet: unsplashSrcSet(images.beforeAfter, [640, 800, 1024, 1400]),
  sizes: '(min-width: 1056px) 1024px, calc(100vw - 2rem)',
  width: 1400,
  height: 1048,
  draggable: false,
  loading: 'lazy' as const,
  decoding: 'async' as const,
}

// Visuel d'illustration : remplacer par de vraies photos avant/après du client.
export function BeforeAfter() {
  const boxRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pos = useMotionValue(50)
  const handleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(boxRef, { once: true, margin: '-120px' })

  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`)
  const left = useMotionTemplate`${pos}%`
  // Mise à jour directe du DOM : pas de rendu React à chaque frame pendant le glissement.
  useMotionValueEvent(pos, 'change', (v) => handleRef.current?.setAttribute('aria-valuenow', String(Math.round(v))))

  useEffect(() => {
    if (!inView) return
    const controls = animate(pos, [50, 30, 70, 50], { duration: 1.6, ease: 'easeInOut', delay: 0.2 })
    return () => controls.stop()
  }, [inView, pos])

  const setFromEvent = (e: PointerEvent<HTMLDivElement>) => {
    const r = boxRef.current!.getBoundingClientRect()
    pos.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)))
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') pos.set(Math.max(0, pos.get() - 5))
    if (e.key === 'ArrowRight') pos.set(Math.min(100, pos.get() + 5))
  }

  return (
    <section id="avant-apres" className="relative px-4 py-20 sm:py-24">
      <SectionHeading
        eyebrow="Avant / Après"
        title="La différence se voit tout de suite"
        highlight="différence"
        subtitle="Faites glisser le curseur. Poussière, taches, poils, traces : on remet tout à neuf."
      />

      <div className="mx-auto mt-12 max-w-5xl">
        <div
          ref={boxRef}
          onPointerDown={(e) => {
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            setFromEvent(e)
          }}
          onPointerMove={(e) => dragging.current && setFromEvent(e)}
          onPointerUp={() => (dragging.current = false)}
          className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-3xl border border-white/10 sm:aspect-[16/9]"
        >
          {/* Après */}
          <img {...imgProps} alt="Voiture après nettoyage" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 font-display text-xs font-bold uppercase italic">Après</span>

          {/* Avant */}
          <m.div className="absolute inset-0" style={{ clipPath: clip }}>
            <img
              {...imgProps}
              alt="Voiture avant nettoyage"
              className="absolute inset-0 h-full w-full object-cover [filter:sepia(0.55)_saturate(0.6)_brightness(0.62)_contrast(0.85)]"
            />
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{
                background:
                  'radial-gradient(circle at 20% 70%, rgba(110,80,40,0.55), transparent 35%), radial-gradient(circle at 70% 40%, rgba(90,70,40,0.45), transparent 30%), radial-gradient(circle at 45% 85%, rgba(80,60,30,0.6), transparent 30%), linear-gradient(180deg, rgba(120,100,70,0.25), rgba(60,45,25,0.45))',
              }}
            />
            <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 font-display text-xs font-bold uppercase italic backdrop-blur">Avant</span>
          </m.div>

          {/* Poignée */}
          <m.div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" style={{ left }}>
            <div
              ref={handleRef}
              role="slider"
              tabIndex={0}
              aria-label="Comparer avant et après"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={50}
              onKeyDown={onKey}
              className="absolute top-1/2 left-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-brand shadow-[0_0_0_8px_rgba(225,6,0,0.25)] outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              <ChevronsLeftRight className="h-6 w-6" />
            </div>
          </m.div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-carbon/80 p-5 sm:flex-row">
          <p className="flex items-center gap-3 text-sm text-white/75 sm:text-base">
            <Camera className="h-5 w-5 shrink-0 text-brand" />
            Véhicule très sale ? Envoyez-nous une photo, on vous répond avec un devis.
          </p>
          <ShimmerButton href={whatsappLink('Bonjour CarClean ! Je vous envoie des photos de mon véhicule pour un devis.')} target="_blank" rel="noreferrer" className="shrink-0 text-xs">
            Devis sur photo
          </ShimmerButton>
        </div>
      </div>
    </section>
  )
}
