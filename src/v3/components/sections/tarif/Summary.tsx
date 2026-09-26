import { useEffect, useRef, useState } from 'react'
import { ChevronDown, MessageSquare, Phone } from 'lucide-react'
import { petHairOption } from '../../../data/content'
import { fr } from '../../../lib/fr'
import { smsLink, telLink, whatsappLink } from '../../../lib/links'
import { buildMessage, liveSummary, phoneRecap, type QuoteState } from '../../../lib/message'
import { computeQuote, distanceLabel, euro } from '../../../lib/pricing'
import { cn } from '../../../lib/utils'
import { WhatsAppIcon } from '../../ui/brand-icons'
import { CutButton } from '../../ui/cut-button'
import { Odometer } from '../../ui/odometer'
import { Stitch } from '../../ui/stitch'

// Valeur qui change : un bref éclair rouge (couleur seulement), rejoué via la clé.
// Pas d'éclair au premier affichage : seulement quand la valeur change.
function Flash({ value, className }: { value: string; className?: string }) {
  const [prev, setPrev] = useState(value)
  const [n, setN] = useState(0)
  if (prev !== value) {
    setPrev(value)
    setN(n + 1)
  }
  return (
    <span key={n} className={cn('inline-block', n > 0 && 'animate-flash', className)}>
      {value}
    </span>
  )
}

export function Summary({ state }: { state: QuoteState }) {
  const q = computeQuote(state.formula, state.petHair, state.distance)
  const message = buildMessage(state)
  const d = state.distance

  const travelTerm = d && d.kind !== 'unknown' ? `Déplacement · ${distanceLabel(d)}` : 'Déplacement'
  const travelValue =
    q.travelFee === null ? (d?.kind === 'unknown' ? 'à calculer' : 'à préciser') : q.travelFee === 0 ? 'Inclus' : `+${euro(q.travelFee)}`

  // Annonce lecteur d'écran, temporisée pour ne pas bavarder pendant un glissement
  // Rien n'est annoncé au chargement : seulement quand le visiteur change quelque chose.
  const [announce, setAnnounce] = useState('')
  const live = liveSummary(state)
  const initialLive = useRef(live)
  useEffect(() => {
    if (live === initialLive.current && announce === '') return
    const t = setTimeout(() => setAnnounce(live), 500)
    return () => clearTimeout(t)
  }, [live, announce])

  return (
    <aside id="demande" aria-labelledby="demande-title" className="relative cut bg-steel p-6 [--c:var(--cut-lg)] [--surface:var(--color-steel)] sm:p-8 lg:p-6 xl:p-8">
      <Stitch double className="absolute inset-x-4 top-3" />
      <h3 id="demande-title" className="mt-2 text-base font-semibold">
        Votre demande
      </h3>

      <dl className="mt-3">
        <div className="flex min-h-11 items-center justify-between gap-4 border-b border-rule py-2">
          <dt className="text-[15px] text-white/75">Formule {q.formula.name}</dt>
          <dd className="font-semibold tabular-nums">
            <Flash value={euro(q.formula.price)} />
          </dd>
        </div>
        <div className="flex min-h-11 items-center justify-between gap-4 border-b border-rule py-2">
          <dt className="text-[15px] text-white/75">{petHairOption.label}</dt>
          <dd className={cn('font-semibold tabular-nums', !state.petHair && 'text-mist')}>
            <Flash value={state.petHair ? `+${euro(q.pets)}` : 'Non'} />
          </dd>
        </div>
        <div className="flex min-h-11 items-center justify-between gap-4 border-b border-rule py-2">
          <dt className="min-w-0 text-[15px] text-white/75">{travelTerm}</dt>
          <dd className={cn('shrink-0 font-semibold tabular-nums', q.travelFee === null && 'text-mist')}>
            <Flash value={travelValue} />
          </dd>
        </div>
      </dl>

      <div id="demande-total" className="mt-6">
        <p className="font-display text-xl leading-none font-bold italic uppercase text-mist">Total</p>
        <div className="mt-2 flex items-baseline justify-end">
          {/* Le € est le dernier tambour, rouge, dans la même fenêtre que les chiffres */}
          <span className="inline-flex items-baseline cut bg-ink pr-[0.18em] pl-[0.04em] font-display text-[clamp(3.25rem,5vw,4.75rem)] leading-none font-bold italic [--c:var(--cut-sm)]">
            <Odometer value={q.total} />
            <span className="-ml-[0.08em] text-[0.45em] text-brand-light">€</span>
          </span>
        </div>
        {q.partial && <p className="mt-1 text-right text-sm text-mist">hors déplacement</p>}
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </span>

      <div className="mt-6">
        <CutButton
          href={whatsappLink(message)}
          target="_blank"
          rel="noreferrer"
          size="lg"
          block
          className="lg:max-xl:px-4 lg:max-xl:text-[15px]"
          icon={<WhatsAppIcon className="h-5 w-5" />}
        >
          Envoyer sur WhatsApp
        </CutButton>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <CutButton
            href={smsLink(message)}
            aria-label="Envoyer par SMS"
            variant="outline"
            size="md"
            block
            className="px-3"
            icon={<MessageSquare aria-hidden className="h-5 w-5" />}
          >
            <span className="hidden sm:max-lg:inline">Envoyer par&nbsp;</span>SMS
          </CutButton>
          <CutButton href={telLink} variant="outline" size="md" block className="px-3" icon={<Phone aria-hidden className="h-5 w-5" />}>
            Appeler
          </CutButton>
        </div>
      </div>

      <p className="mt-3 text-sm text-mist">
        {fr('Au téléphone, dites :')} <span className="text-white/85">{phoneRecap(state)}</span>
      </p>

      <details className="group/msg mt-4">
        <summary className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/85 hover:text-white">
          Voir le message envoyé
          <ChevronDown aria-hidden className="h-4 w-4 transition-transform duration-200 group-open/msg:rotate-180" />
        </summary>
        <p className="mt-1 cut-bl bg-ink p-4 text-sm leading-[1.55] whitespace-pre-line text-white/85 [--c:var(--cut)]">{message}</p>
      </details>

      <p className="mt-4 text-sm leading-[1.55] text-mist">
        {fr('Total calculé avec la grille ci-dessus. Véhicule très sale : devis sur photo.')}
      </p>
    </aside>
  )
}
