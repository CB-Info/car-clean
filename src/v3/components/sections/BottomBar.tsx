import { Phone } from 'lucide-react'
import { WhatsAppIcon } from '../ui/brand-icons'
import { telLink, whatsappLink } from '../../lib/links'
import { buildMessage, genericMessage, type QuoteState } from '../../lib/message'
import { useVisibleIds } from '../../lib/use-visible-ids'
import { cn } from '../../lib/utils'

const watch = ['hero-actions', 'tarif', 'contact']

// Remplace le bouton d'appel flottant : barre fine, sans pulsation ni lueur.
// Masquée quand les boutons du hero, le tarif (qui a sa propre barre) ou l'appel final sont à l'écran.
export function BottomBar({ state }: { state: QuoteState }) {
  const visible = useVisibleIds(watch)
  const hidden = visible.size > 0
  const message = state.touched ? buildMessage(state) : genericMessage

  return (
    <div
      inert={hidden}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 grid h-[calc(3.5rem+env(safe-area-inset-bottom))] grid-cols-[1fr_auto_1fr] border-t border-rule bg-ink pb-[env(safe-area-inset-bottom)] transition-[translate] duration-200 ease-out-expo lg:hidden',
        hidden && 'translate-y-full',
      )}
    >
      <a href={telLink} className="flex items-center justify-center gap-2 font-display text-[15px] font-bold italic uppercase active:bg-white/5">
        <Phone aria-hidden className="h-5 w-5 text-brand-light" />
        Appeler
      </a>
      <span aria-hidden className="my-3 w-px -skew-x-10 bg-white/15" />
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noreferrer"
        className="group on-red relative isolate flex items-center justify-center gap-2 font-display text-[15px] font-bold italic uppercase focus-visible:outline-white focus-visible:-outline-offset-4"
      >
        <span aria-hidden className="absolute inset-y-0 right-0 left-2 -z-10 bg-brand transition-colors group-active:bg-brand-dark [clip-path:polygon(0_0,calc(100%_-_var(--cut))_0,100%_var(--cut),100%_100%,0_100%)]" />
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </a>
    </div>
  )
}
