import { Phone } from 'lucide-react'
import { SlantButton } from '../ui/slant-button'
import { RollingNumber } from '../ui/rolling-number'
import { WhatsAppIcon } from '../ui/brand-icons'
import { buildMessage, summaryLine, type QuoteState } from '../../lib/message'
import { computeQuote } from '../../lib/pricing'
import { scrollToId } from '../../lib/smooth-scroll'
import { telLink, whatsappLink } from '../../lib/links'
import { useVisibleIds } from '../../lib/use-visible-ids'
import { cn } from '../../lib/utils'

const watched = ['hero-actions', 'tarif', 'estimate-actions', 'contact'] as const

type Props = { state: QuoteState; touched: boolean }
type Mode = 'hidden' | 'estimate' | 'contact'

// Barre d'action mobile (remplace le bouton d'appel flottant). Un seul IntersectionObserver :
// masquée quand les boutons du hero, ceux du devis ou le bandeau contact sont à l'écran (doublon),
// total en direct pendant qu'on règle le tarif, sinon Appeler / WhatsApp.
export function MobileDock({ state, touched }: Props) {
  const visible = useVisibleIds(watched, '0px 0px -64px 0px')
  const mode: Mode =
    !visible || visible.has('hero-actions') || visible.has('contact') || visible.has('estimate-actions')
      ? 'hidden'
      : visible.has('tarif')
        ? 'estimate'
        : 'contact'

  const q = computeQuote(state.formula, state.petHair, state.distance)
  const message = buildMessage(state)
  const shown = mode !== 'hidden'

  return (
    <div
      inert={!shown}
      aria-hidden={!shown || undefined}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden',
        shown ? 'translate-y-0 transition-transform duration-200 ease-out-expo' : 'translate-y-full transition-transform duration-150 ease-out-expo',
      )}
    >
      <div className="grid">
        {/* Mode devis */}
        <div
          inert={mode !== 'estimate'}
          className={cn('flex items-center gap-3 transition-opacity duration-150 [grid-area:1/1]', mode === 'estimate' ? 'opacity-100' : 'pointer-events-none opacity-0')}
        >
          <button
            onClick={() => scrollToId('estimate')}
            aria-label="Voir le détail de l’estimation"
            className="flex h-12 min-w-0 flex-1 flex-col justify-center text-left"
          >
            <span className="block truncate text-[13px] text-mist tabular-nums">{summaryLine(state)}</span>
            <span className="font-display text-[28px] leading-none font-bold italic">
              <RollingNumber value={q.total} />
            </span>
          </button>
          <SlantButton href={whatsappLink(message)} target="_blank" rel="noreferrer" className="mr-1.5 px-5">
            <WhatsAppIcon className="h-5 w-5" /> Envoyer
          </SlantButton>
        </div>

        {/* Mode contact */}
        <div
          inert={mode !== 'contact'}
          className={cn('grid grid-cols-2 gap-2 px-1.5 transition-opacity duration-150 [grid-area:1/1]', mode === 'contact' ? 'opacity-100' : 'pointer-events-none opacity-0')}
        >
          <SlantButton variant="ghost" href={telLink} className="w-full">
            <Phone aria-hidden className="h-5 w-5" /> Appeler
          </SlantButton>
          <SlantButton href={whatsappLink(touched ? message : undefined)} target="_blank" rel="noreferrer" className="w-full">
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp
          </SlantButton>
        </div>
      </div>
    </div>
  )
}
