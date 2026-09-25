import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { animate, m, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'
import { ChevronsLeftRight } from 'lucide-react'
import { SlantTag } from '../ui/slant-tag'
import { images } from '../../data/content'
import { fr } from '../../lib/fr'
import { whatsappLink } from '../../lib/links'
import { usePrefersReducedMotion } from '../../lib/use-reduced-motion'
import { unsplashSrcSet } from '../../lib/utils'

const imgProps = {
  src: images.beforeAfter,
  srcSet: unsplashSrcSet(images.beforeAfter, [640, 800, 1024, 1400]),
  sizes: '(min-width: 1280px) 820px, (min-width: 1024px) 64vw, calc(100vw - 2rem)',
  width: 1400,
  height: 1048,
  draggable: false,
  loading: 'lazy' as const,
  decoding: 'async' as const,
}

const valueText = (v: number) => `Avant ${Math.round(100 - v)} %, après ${Math.round(v)} %`

// Visuel d'illustration : remplacer par la vraie paire avant/après du client (et retirer la mention).
export function BeforeAfter() {
  const boxRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pos = useMotionValue(50)
  const inView = useInView(boxRef, { once: true, margin: '-120px' })
  const reduced = usePrefersReducedMotion()

  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`)
  const left = useMotionTemplate`${pos}%`
  // Mise à jour directe du DOM : pas de rendu React à chaque frame pendant le glissement.
  useMotionValueEvent(pos, 'change', (v) => {
    handleRef.current?.setAttribute('aria-valuenow', String(Math.round(v)))
    handleRef.current?.setAttribute('aria-valuetext', valueText(v))
  })

  // Indice de manipulation joué une fois ; animate() impératif ignore MotionConfig, d'où le test explicite.
  useEffect(() => {
    if (!inView || reduced) return
    const controls = animate(pos, [50, 30, 70, 50], { duration: 1.6, ease: 'easeInOut', delay: 0.2 })
    return () => controls.stop()
  }, [inView, pos, reduced])

  const setFromEvent = (e: PointerEvent<HTMLDivElement>) => {
    const r = boxRef.current!.getBoundingClientRect()
    pos.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)))
  }
  const onKey = (e: KeyboardEvent) => {
    const stepBy = e.shiftKey ? 10 : 5
    const next =
      e.key === 'ArrowLeft' || e.key === 'ArrowDown'
        ? pos.get() - stepBy
        : e.key === 'ArrowRight' || e.key === 'ArrowUp'
          ? pos.get() + stepBy
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? 100
              : null
    if (next === null) return
    e.preventDefault()
    pos.set(Math.min(100, Math.max(0, next)))
  }
  const stop = () => (dragging.current = false)

  return (
    <section id="avant-apres" className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-4">
          <h2 className="font-display text-[clamp(2rem,8vw,2.5rem)] leading-[0.98] font-bold tracking-[-0.01em] italic uppercase lg:text-5xl">
            Avant <span className="text-brand-light">/</span> Après
          </h2>
          <p className="mt-5 text-base text-white/70">Faites glisser la poignée pour comparer.</p>
          <p className="mt-8 max-w-[40ch] text-base leading-relaxed text-white/80">
            {fr('Intérieur très sale ? ')}
            <a
              href={whatsappLink('Bonjour CarClean ! Je vous envoie des photos de mon véhicule pour un devis.')}
              target="_blank"
              rel="noreferrer"
              className="text-link text-white"
            >
              Envoyez une photo sur WhatsApp
            </a>
            , on vous répond avec un devis.
          </p>
        </div>

        <div className="mt-10 lg:col-span-8 lg:mt-0">
          {/* Cadre à pan coupé (non focalisable) ; la zone de glissement est à l'intérieur */}
          <div className="cut-tr [--cut:20px]">
            <div
              ref={boxRef}
              onPointerDown={(e) => {
                dragging.current = true
                e.currentTarget.setPointerCapture(e.pointerId)
                setFromEvent(e)
              }}
              onPointerMove={(e) => dragging.current && setFromEvent(e)}
              onPointerUp={stop}
              onPointerCancel={stop}
              onLostPointerCapture={stop}
              className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none sm:aspect-[16/10]"
            >
              {/* Après */}
              <img {...imgProps} alt="Habitacle après nettoyage (visuel d’illustration)" className="absolute inset-0 h-full w-full object-cover" />
              <SlantTag variant="red" className="absolute top-4 right-6">
                Après
              </SlantTag>

              {/* Avant : même image, simplement éteinte, en attendant les vraies photos */}
              <m.div className="absolute inset-0" style={{ clipPath: clip }}>
                <img
                  {...imgProps}
                  alt="Habitacle avant nettoyage (visuel d’illustration)"
                  className="absolute inset-0 h-full w-full object-cover [filter:grayscale(.7)_brightness(.55)_contrast(.9)]"
                />
                <SlantTag className="absolute top-4 left-6">Avant</SlantTag>
              </m.div>

              <span className="absolute bottom-3 left-3 bg-ink/80 px-2.5 py-1 text-[12px] text-white/85">{fr('Visuel d’illustration')}</span>

              {/* Séparateur et poignée */}
              <m.div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white" style={{ left }}>
                <div
                  ref={handleRef}
                  role="slider"
                  tabIndex={0}
                  aria-label="Comparer avant et après"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={50}
                  aria-valuetext={valueText(50)}
                  onKeyDown={onKey}
                  className="absolute top-1/2 left-1/2 grid h-11 w-14 -translate-x-1/2 -translate-y-1/2 -skew-x-10 place-items-center border-2 border-white bg-brand shadow-drop focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                >
                  <ChevronsLeftRight aria-hidden className="h-6 w-6 skew-x-10" />
                </div>
              </m.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
