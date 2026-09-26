import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { ArrowRight, Menu, Phone, X } from 'lucide-react'
import { Logo } from '../ui/logo'
import { CutButton } from '../ui/cut-button'
import { WhatsAppIcon } from '../ui/brand-icons'
import { contact } from '../../data/content'
import { scrollToId, startScroll, stopScroll } from '../../lib/smooth-scroll'
import { telLink, whatsappLink } from '../../lib/links'
import { buildMessage, genericMessage, type QuoteState } from '../../lib/message'
import { useVisibleIds } from '../../lib/use-visible-ids'
import { cn } from '../../lib/utils'

// Dans l'ordre de la page
const links = [
  ['tarif', 'Tarif'],
  ['avant-apres', 'Avant / après'],
  ['deroule', 'Déroulé'],
  ['faq', 'FAQ'],
] as const
const sectionIds = links.map(([id]) => id)

export function Navbar({ state }: { state: QuoteState }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const current = useVisibleIds(sectionIds, '-45% 0px -50% 0px')

  // Fond plein dès que le haut du hero quitte l'écran (IntersectionObserver, pas d'écouteur de scroll)
  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel')
    if (!sentinel) return
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    stopScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      startScroll()
    }
  }, [open])

  // Lenis ignore scrollTo tant qu'il est arrêté (menu ouvert) : on le relance avant de défiler.
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    startScroll()
    setOpen(false)
    scrollToId(id)
  }
  // Une seule section courante, même quand une frontière traverse la bande d'observation
  const currentId = [...sectionIds].reverse().find((id) => current.has(id))

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-[160ms]',
        scrolled || open ? 'border-line bg-ink' : 'border-transparent bg-transparent',
      )}
    >
      <nav aria-label="Navigation principale" className="mx-auto flex h-14 max-w-[75rem] items-center justify-between px-4 sm:px-8 lg:h-16">
        <a href="#top" onClick={go('top')} aria-label="CarClean, retour en haut" className="-mx-1 px-1 py-2">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map(([id, label]) => {
            const active = id === currentId
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'group relative block px-3.5 py-2 text-[15px] font-medium transition-colors duration-[160ms] hover:text-white',
                    active ? 'text-white' : 'text-white/70',
                  )}
                >
                  {label}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-x-3.5 bottom-0.5 h-0.5 origin-left bg-brand transition-transform duration-300 ease-out-expo group-hover:scale-x-100',
                      active ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-5">
          <a href={telLink} className="hidden items-center gap-2 text-[15px] font-semibold tabular-nums text-white/80 transition-colors hover:text-white lg:inline-flex">
            <Phone aria-hidden className="h-4 w-4 text-brand-light" />
            {contact.phoneDisplay}
          </a>
          <CutButton href="#tarif" onClick={go('tarif')} size="sm" className="hidden lg:inline-flex">
            Réserver
          </CutButton>
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="-mr-2.5 grid h-11 w-11 place-items-center lg:hidden"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Voile sous le menu ouvert : la page est figée, un toucher dessus referme le menu */}
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-x-0 top-14 bottom-0 -z-10 bg-ink/60 transition-opacity duration-[220ms] ease-out-expo lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Menu mobile : panneau pleine largeur, ouverture en hauteur */}
      <div
        id="menu-mobile"
        inert={!open}
        className={cn(
          'grid bg-ink transition-[grid-template-rows] duration-[220ms] ease-out-expo lg:hidden',
          open ? 'grid-rows-[1fr] border-t border-rule' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul>
            {links.map(([id, label]) => (
              <li key={id} className="border-b border-rule">
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  className="flex h-14 items-center justify-between px-4 font-display text-[1.75rem] leading-none font-bold italic uppercase active:bg-white/5"
                >
                  {label}
                  <ArrowRight aria-hidden className="h-5 w-5 text-brand-light" />
                </a>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 p-4">
            <CutButton href={telLink} variant="outline" block icon={<Phone aria-hidden className="h-5 w-5" />}>
              Appeler
            </CutButton>
            <CutButton
              href={whatsappLink(state.touched ? buildMessage(state) : genericMessage)}
              target="_blank"
              rel="noreferrer"
              block
              icon={<WhatsAppIcon className="h-5 w-5" />}
            >
              WhatsApp
            </CutButton>
          </div>
        </div>
      </div>
    </header>
  )
}
