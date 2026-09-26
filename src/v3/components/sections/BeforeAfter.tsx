import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { animate, m, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react'
import { ArrowRight, ChevronsLeftRight } from 'lucide-react'
import { SlantTag } from '../ui/slant-tag'
import { images } from '../../data/content'
import { fr } from '../../lib/fr'
import { whatsappLink } from '../../lib/links'
import { unsplashSrcSet } from '../../lib/utils'

const imgProps = {
  srcSet: unsplashSrcSet(images.beforeAfter, [640, 800, 1024, 1400]),
  sizes: '(min-width: 1024px) 760px, calc(100vw - 2rem)',
  width: 1400,
  height: 1048,
  draggable: false,
  loading: 'lazy' as const,
  decoding: 'async' as const,
}

const valueText = (v: number) => {
  const r = Math.round(v)
  return `Avant ${r} %, après ${100 - r} %`
}

// Visuel d'illustration (même photo assombrie) : à remplacer par une vraie paire avant/après du client.
export function BeforeAfter() {
  const boxRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const interacted = useRef(false)
  const pos = useMotionValue(50)
  const handleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(boxRef, { once: true, margin: '-120px' })
  const reduce = useReducedMotion()

  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`)
  const left = useMotionTemplate`${pos}%`
  // Mise à jour directe du DOM : pas de rendu React à chaque frame pendant le glissement.
  useMotionValueEvent(pos, 'change', (v) => {
    handleRef.current?.setAttribute('aria-valuenow', String(Math.round(v)))
    handleRef.current?.setAttribute('aria-valuetext', valueText(v))
  })

  // Indice unique 50 → 30 → 70 → 50 : apprend le geste. Jamais en mouvement réduit.
  useEffect(() => {
    if (!inView || reduce || interacted.current) return
    const controls = animate(pos, [50, 30, 70, 50], { duration: 1.6, ease: 'easeInOut', delay: 0.2 })
    return () => controls.stop()
  }, [inView, pos, reduce])

  const setFromEvent = (e: PointerEvent<HTMLDivElement>) => {
    const r = boxRef.current!.getBoundingClientRect()
    pos.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)))
  }
  const stop = () => {
    dragging.current = false
  }
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 5
    const v = pos.get()
    let next: number | null = null
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = v - step
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = v + step
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = 100
    if (next === null) return
    e.preventDefault()
    interacted.current = true
    pos.stop()
    pos.set(Math.min(100, Math.max(0, next)))
  }

  return (
    <section id="avant-apres" className="bg-ink py-20 [--surface:var(--color-ink)] lg:py-24">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div className="lg:col-span-4">
          <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.04] font-bold tracking-[-0.01em] italic uppercase">Avant / après</h2>
          <p className="mt-4 text-base text-mist">Faites glisser la poignée pour comparer.</p>
          <SlantTag variant="outline" className="mt-4">
            {fr('Photos d’illustration')}
          </SlantTag>
          <div className="hidden lg:block">
            <PhotoQuote />
          </div>
        </div>

        <div className="mt-10 lg:col-span-8 lg:mt-0">
          <div className="cut [--c:var(--cut-lg)]">
            <div
              ref={boxRef}
              onPointerDown={(e) => {
                dragging.current = true
                interacted.current = true
                pos.stop()
                e.currentTarget.setPointerCapture(e.pointerId)
                setFromEvent(e)
              }}
              onPointerMove={(e) => dragging.current && setFromEvent(e)}
              onPointerUp={stop}
              onPointerCancel={stop}
              onLostPointerCapture={stop}
              className="relative aspect-[4/3] cursor-ew-resize touch-pan-y bg-steel select-none"
            >
              {/* Après */}
              <img src={images.beforeAfter} {...imgProps} alt="Illustration : habitacle après nettoyage" className="absolute inset-0 h-full w-full object-cover" />
              <SlantTag variant="red" className="absolute top-4 right-8">
                Après
              </SlantTag>

              {/* Avant : même photo désaturée et assombrie, rien de plus */}
              <m.div className="absolute inset-0" style={{ clipPath: clip }}>
                <img
                  src={images.beforeAfter}
                  {...imgProps}
                  alt="Illustration : habitacle avant nettoyage"
                  className="absolute inset-0 h-full w-full object-cover [filter:grayscale(.6)_brightness(.55)_contrast(1.1)]"
                />
                <SlantTag variant="ink" className="absolute top-4 left-6">
                  Avant
                </SlantTag>
              </m.div>

              {/* Séparateur + poignée */}
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
                  className={[
                    'absolute top-1/2 left-1/2 isolate grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center outline-none',
                    'before:absolute before:-inset-1 before:-z-20 before:cut before:bg-brand-light before:opacity-0 before:[--c:calc(var(--cut-sm)_+_2.34px)] focus-visible:before:opacity-100',
                    'after:absolute after:-inset-0.5 after:-z-10 after:cut after:bg-[var(--surface)] after:opacity-0 after:[--c:calc(var(--cut-sm)_+_1.17px)] focus-visible:after:opacity-100',
                  ].join(' ')}
                >
                  {/* L'ombre portée est sur un parent : un clip-path couperait un box-shadow */}
                  <span aria-hidden className="absolute inset-0 [filter:drop-shadow(0_10px_14px_rgb(0_0_0/.6))]">
                    <span className="block h-full w-full cut bg-white [--c:var(--cut-sm)]" />
                  </span>
                  <ChevronsLeftRight aria-hidden className="relative h-5 w-5 text-ink" />
                </div>
              </m.div>
            </div>
          </div>

          <div className="lg:hidden">
            <PhotoQuote />
          </div>
        </div>
      </div>
    </section>
  )
}

function PhotoQuote() {
  return (
    <div className="mt-10">
      <p className="max-w-[40ch] text-base leading-[1.6] text-white/80">
        {fr('Intérieur très sale ? Envoyez une photo, on vous répond avec un devis.')}
      </p>
      <a
        href={whatsappLink('Bonjour CarClean ! Voici une photo de mon intérieur pour un devis.')}
        target="_blank"
        rel="noreferrer"
        className="link mt-3 inline-flex items-center gap-2 py-1 text-base font-semibold"
      >
        Envoyer une photo sur WhatsApp
        <ArrowRight aria-hidden className="h-[18px] w-[18px]" />
      </a>
    </div>
  )
}
