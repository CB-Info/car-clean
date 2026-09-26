import { WhatsAppIcon } from '../../ui/brand-icons'
import { CutButton } from '../../ui/cut-button'
import { Odometer } from '../../ui/odometer'
import { whatsappLink } from '../../../lib/links'
import { buildMessage, summaryLine, type QuoteState } from '../../../lib/message'
import { computeQuote, euro } from '../../../lib/pricing'
import { scrollToId } from '../../../lib/smooth-scroll'
import { cn } from '../../../lib/utils'

// Total en direct sous le pouce (mobile). Collant en CSS pur dans #tarif : il part avec la section.
// Il s'efface pendant que le récapitulatif complet (#demande-total) est à l'écran.
export function TarifBar({ state, hidden }: { state: QuoteState; hidden: boolean }) {
  const q = computeQuote(state.formula, state.petHair, state.distance)
  return (
    <div
      inert={hidden}
      className={cn(
        'sticky bottom-0 z-30 mt-10 flex h-[calc(4rem+env(safe-area-inset-bottom))] items-center gap-3 border-t border-rule bg-ink px-4 pb-[env(safe-area-inset-bottom)] transition-[translate,opacity,visibility] duration-200 ease-out-expo lg:hidden',
        hidden && 'invisible translate-y-full opacity-0',
      )}
    >
      <button
        type="button"
        onClick={() => scrollToId('demande')}
        className="min-w-0 flex-1 text-left"
        aria-label={`Voir le récapitulatif : ${summaryLine(state)}, ${euro(q.total)}${q.partial ? ' hors déplacement' : ''}`}
      >
        <span className="block truncate text-[13px] leading-tight text-mist">{summaryLine(state)}</span>
        <span className="mt-0.5 flex items-baseline font-display text-[1.75rem] leading-none font-bold italic">
          <Odometer value={q.total} className="-ml-[0.15em]" />
          <span className="text-[0.5em] text-brand-light">€</span>
          {q.partial && <span className="ml-2 font-sans text-xs font-normal not-italic text-mist">hors déplacement</span>}
        </span>
      </button>
      <CutButton
        href={whatsappLink(buildMessage(state))}
        target="_blank"
        rel="noreferrer"
        size="icon"
        aria-label="Envoyer sur WhatsApp"
        icon={<WhatsAppIcon className="h-5 w-5" />}
      />
    </div>
  )
}
