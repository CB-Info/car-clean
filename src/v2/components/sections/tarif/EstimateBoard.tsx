import { useEffect, useState } from 'react'
import { MessageSquare, Phone } from 'lucide-react'
import { SlantButton } from '../../ui/slant-button'
import { RollingNumber } from '../../ui/rolling-number'
import { WhatsAppIcon } from '../../ui/brand-icons'
import { contact, petHairOption } from '../../../data/content'
import { NBSP, fr } from '../../../lib/fr'
import { announceLine, buildMessage, phoneRecap, type QuoteState } from '../../../lib/message'
import { computeQuote, distanceText, euro } from '../../../lib/pricing'
import { smsLink, telLink, whatsappLink } from '../../../lib/links'
import { useChangeVersion } from '../../../lib/use-change-version'
import { usePrefersReducedMotion } from '../../../lib/use-reduced-motion'
import { cn } from '../../../lib/utils'

type Props = { state: QuoteState; id?: string; className?: string }

// Le panneau des stands : lignes du devis, total qui bascule chiffre par chiffre, et l'envoi du message.
// Volontairement court (≈ 570 px) : il doit tenir en entier, collé, sur un portable de 768 px de haut.
// L'aperçu du message et la note « devis sur photo » vivent dans MessagePreview (colonne de gauche).
export function EstimateBoard({ state, id, className }: Props) {
  const q = computeQuote(state.formula, state.petHair, state.distance)
  const d = state.distance
  const message = buildMessage(state)
  const reduced = usePrefersReducedMotion()

  // Annonce pour les lecteurs d'écran, regroupée (400 ms) et jamais au chargement.
  const announceText = announceLine(state)
  const announceVersion = useChangeVersion(announceText)
  const [announce, setAnnounce] = useState('')
  useEffect(() => {
    if (announceVersion === 0) return
    const t = window.setTimeout(() => setAnnounce(announceText), 400)
    return () => window.clearTimeout(t)
  }, [announceVersion, announceText])

  const travelValue =
    !d ? 'À choisir' : d.kind === 'unknown' ? 'À calculer' : q.travelFee === null ? 'À préciser' : q.travelFee === 0 ? 'Inclus' : `+${euro(q.travelFee)}`
  const travelSub = !d ? undefined : d.kind === 'unknown' ? 'avec votre adresse' : distanceText(d)

  return (
    <aside id={id} aria-labelledby="estimate-title" className={cn('cut-tr bg-steel p-6 [--cut:16px] sm:p-8', className)}>
      <h3 id="estimate-title" className="font-display text-lg font-bold italic uppercase">
        Votre estimation
      </h3>

      <dl className="mt-4">
        <LedgerRow label={`Formule ${q.formula.name}`} value={euro(q.formula.price)} reduced={reduced} />
        <LedgerRow label={petHairOption.label} value={state.petHair ? `+${euro(petHairOption.price)}` : 'Non'} muted={!state.petHair} reduced={reduced} />
        <LedgerRow label="Déplacement" sub={travelSub} value={travelValue} muted={q.travelFee === null} reduced={reduced} />
      </dl>

      <div className="mt-6">
        <p className="font-display text-base font-bold text-mist italic uppercase">{q.complete ? 'Total estimé' : 'Total hors déplacement'}</p>
        <p className="mt-2 text-right font-display text-6xl font-bold italic xl:text-7xl">
          <RollingNumber value={q.total} />
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      <div id="estimate-actions" className="mt-6">
        <SlantButton size="lg" block href={whatsappLink(message)} target="_blank" rel="noreferrer">
          <WhatsAppIcon className="h-5 w-5" /> Envoyer sur WhatsApp
        </SlantButton>
        {/* Grand écran : SMS et Appeler sur une ligne, libellés courts (la colonne fait 20 rem) */}
        <div className="mt-2 grid gap-2 px-1.5 sm:grid-cols-2">
          <SlantButton variant="ghost" href={smsLink(message)} aria-label="Envoyer par SMS" className="w-full lg:px-3">
            <MessageSquare aria-hidden className="h-5 w-5" />
            <span className="lg:hidden">Envoyer par SMS</span>
            <span className="hidden lg:inline">SMS</span>
          </SlantButton>
          <SlantButton variant="ghost" href={telLink} aria-label={`Appeler le ${contact.phoneDisplay}`} className="w-full lg:px-3">
            <Phone aria-hidden className="h-5 w-5" /> Appeler
          </SlantButton>
        </div>
        <p className="mt-3 text-[13px] leading-snug text-mist">
          {fr('Au téléphone, dites :')} «{NBSP}
          <span className="text-white">{phoneRecap(state)}</span>
          {NBSP}»
        </p>
      </div>
    </aside>
  )
}

// Ligne du devis : quand sa valeur change, un aplat penché la traverse et la nouvelle valeur remonte.
function LedgerRow({ label, sub, value, muted, reduced }: { label: string; sub?: string; value: string; muted?: boolean; reduced: boolean }) {
  const version = useChangeVersion(`${label}|${sub ?? ''}|${value}`)
  const changed = version > 0
  return (
    <div className="relative grid grid-cols-[1fr_auto] items-baseline gap-4 overflow-clip border-b border-white/10 py-3">
      {changed && !reduced && <span key={version} aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-2/5 animate-row-wipe bg-brand/20" />}
      <dt className="relative text-[15px] text-white/75">
        {label}
        {sub && <span className="block text-[13px] text-mist">{sub}</span>}
      </dt>
      <dd className="relative overflow-clip text-right text-[15px] font-semibold tabular-nums">
        <span key={version} className={cn('block', muted ? 'text-white/60' : 'text-white', changed && (reduced ? 'animate-hold-red' : 'animate-value-in'))}>
          {value}
        </span>
      </dd>
    </div>
  )
}
