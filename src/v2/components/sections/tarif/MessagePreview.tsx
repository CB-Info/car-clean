import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { fr } from '../../../lib/fr'
import { messageLines, type QuoteState } from '../../../lib/message'
import { whatsappLink } from '../../../lib/links'
import { cn } from '../../../lib/utils'

const photoQuote = whatsappLink('Bonjour CarClean ! Je vous envoie des photos de mon véhicule pour un devis.')

type Props = { state: QuoteState; className?: string }

// Le message prérempli, tel qu'il part sur WhatsApp ou par SMS.
// Grand écran : 4e bloc de la colonne de gauche, toujours ouvert, pour que le panneau d'estimation
// reste court et collé à l'écran pendant qu'on choisit la distance.
// Mobile : repliable, juste sous le panneau d'estimation.
export function MessagePreview({ state, className }: Props) {
  const body = (
    <p className="text-sm leading-[1.6] whitespace-pre-line text-white/60">
      {messageLines(state).map((l, i) => (
        <MessageLine key={i} k={l.k}>
          {l.v}
        </MessageLine>
      ))}
    </p>
  )

  return (
    <div className={className}>
      <div className="hidden lg:grid lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] xl:gap-10">
        <div>
          <h3 className="font-display text-lg font-bold italic uppercase">Le message envoyé</h3>
          <p className="mt-1 max-w-[46ch] text-sm text-mist">
            {fr('Il s’ouvre prérempli dans WhatsApp ou vos SMS : complétez l’adresse, le véhicule et vos jours possibles, puis envoyez.')}
          </p>
          <Footnote className="mt-4" />
        </div>
        <div className="bg-ink px-5 py-4">{body}</div>
      </div>

      <div className="lg:hidden">
        <details className="group">
          <summary className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
            Voir le message envoyé
            <ChevronDown aria-hidden className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="mt-2 bg-ink px-4 py-3">{body}</div>
        </details>
        <Footnote className="mt-3" />
      </div>
    </div>
  )
}

function Footnote({ className }: { className?: string }) {
  return (
    <p className={cn('text-[13px] text-mist', className)}>
      {fr('Estimation à confirmer ensemble. Véhicule très sale :')}{' '}
      <a href={photoQuote} target="_blank" rel="noreferrer" className="text-link text-white/85 hover:text-white">
        devis sur photo
      </a>
      .
    </p>
  )
}

function MessageLine({ k, children }: { k: string; children?: ReactNode }) {
  return (
    <>
      {k}
      {children && <span className="text-white">{children}</span>}
      {'\n'}
    </>
  )
}
