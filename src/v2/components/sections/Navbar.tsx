import { useState } from 'react'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, Phone, X } from 'lucide-react'
import { Logo } from '../ui/logo'
import { ShimmerButton } from '../magicui/shimmer-button'
import { scrollToId } from '../../lib/smooth-scroll'
import { telLink } from '../../lib/links'
import { cn } from '../../lib/utils'

const links = [
  ['formules', 'Formules'],
  ['simulateur', 'Tarif'],
  ['avant-apres', 'Avant / Après'],
  ['deroule', 'Déroulé'],
  ['faq', 'FAQ'],
] as const

export function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <m.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3"
    >
      <nav
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-6',
          scrolled ? 'border-white/10 bg-ink/90 shadow-lg shadow-black/40' : 'border-transparent bg-transparent',
        )}
      >
        <button onClick={() => go('top')} aria-label="CarClean, retour en haut">
          <Logo />
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map(([id, label]) => (
            <li key={id}>
              <button
                onClick={() => go(id)}
                className="group relative px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ShimmerButton href={telLink} className="hidden px-5 py-2.5 text-xs sm:inline-flex">
            <Phone className="h-4 w-4" /> Réserver
          </ShimmerButton>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 lg:hidden"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-ink/95 p-3 lg:hidden"
          >
            {links.map(([id, label], i) => (
              <m.button
                key={id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                onClick={() => go(id)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-display text-lg font-semibold italic uppercase hover:bg-white/5"
              >
                {label}
                <span className="text-brand">→</span>
              </m.button>
            ))}
            <ShimmerButton href={telLink} className="mt-2 w-full">
              <Phone className="h-4 w-4" /> Appeler maintenant
            </ShimmerButton>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  )
}
