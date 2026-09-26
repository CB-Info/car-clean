import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Menu, Phone, X } from 'lucide-react'
import { Logo } from '../ui/logo'
import { SlantButton } from '../ui/slant-button'
import { WhatsAppIcon } from '../ui/brand-icons'
import { contact } from '../../data/content'
import { buildMessage, type QuoteState } from '../../lib/message'
import { scrollToId } from '../../lib/smooth-scroll'
import { telLink, whatsappLink } from '../../lib/links'
import { useVisibleIds } from '../../lib/use-visible-ids'
import { cn } from '../../lib/utils'

// Ordre de la page
const links = [
  ['tarif', 'Tarif'],
  ['avant-apres', 'Avant / Après'],
  ['deroule', 'Déroulé'],
  ['faq', 'FAQ'],
] as const
const sectionIds = links.map(([id]) => id)

type Props = { state: QuoteState; touched: boolean }

export function Navbar({ state, touched }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const visible = useVisibleIds(sectionIds, '-45% 0px -50% 0px')
  const current = sectionIds.find((id) => visible?.has(id))

  // Fond de la barre : sentinelle en haut du hero observée (aucun écouteur de scroll).
  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel')
    if (!sentinel) return
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      burgerRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={cn('h-16 border-b transition-colors duration-200', scrolled || open ? 'border-line bg-ink/95' : 'border-transparent bg-transparent')}>
        <nav aria-label="Navigation principale" className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <a
            href="#top"
            aria-label="CarClean, retour en haut"
            className="-my-2 inline-flex min-h-11 items-center py-2"
            onClick={(e) => {
              e.preventDefault()
              go('top')
            }}
          >
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={current === id ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    go(id)
                  }}
                  className="group relative block px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white aria-[current=true]:text-white"
                >
                  {label}
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100 group-aria-[current=true]:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <a
              href={telLink}
              aria-label={`Appeler le ${contact.phoneDisplay}`}
              className="hidden items-center gap-2 text-sm text-white/80 tabular-nums underline-offset-[0.22em] transition-colors hover:text-white hover:underline sm:inline-flex"
            >
              <Phone aria-hidden className="h-4 w-4" />
              {contact.phoneDisplay}
            </a>
            <SlantButton
              href="#tarif"
              onClick={(e) => {
                e.preventDefault()
                go('tarif')
              }}
              className="hidden sm:inline-flex"
            >
              Réserver
            </SlantButton>
            <button
              ref={burgerRef}
              onClick={() => setOpen((o) => !o)}
              className="grid h-11 w-11 place-items-center border border-white/15 transition-colors hover:border-white/40 lg:hidden"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              aria-controls="menu"
            >
              {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      <div
        id="menu"
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows] duration-[220ms] ease-out-expo lg:hidden',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="border-b border-line bg-ink">
            <ul>
              {links.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(id)
                    }}
                    className="flex h-14 items-center justify-between border-b border-white/10 px-4 font-display text-2xl font-bold italic uppercase transition-colors hover:bg-white/[0.04]"
                  >
                    {label}
                    <ArrowRight aria-hidden className="h-5 w-5 text-brand-light" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-3 p-4">
              <SlantButton variant="ghost" href={telLink} block className="w-auto">
                <Phone aria-hidden className="h-5 w-5" /> Appeler
              </SlantButton>
              <SlantButton href={whatsappLink(touched ? buildMessage(state) : undefined)} target="_blank" rel="noreferrer" block className="w-auto">
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp
              </SlantButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
