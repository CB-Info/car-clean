import { ChevronDown, MessageSquare, Phone } from 'lucide-react'
import { CutButton } from '../ui/cut-button'
import { WhatsAppIcon } from '../ui/brand-icons'
import { Logo } from '../ui/logo'
import { Stitch } from '../ui/stitch'
import { Selvedge, StrapBar } from './BenefitsMarquee'
import { contact, legal } from '../../data/content'
import { smsLink, telLink, whatsappLink } from '../../lib/links'
import { buildMessage, genericMessage, summaryLine, type QuoteState } from '../../lib/message'
import { computeQuote, euro } from '../../lib/pricing'
import { scrollToId } from '../../lib/smooth-scroll'

const zones = contact.zone.split(' · ')

// Sangle 2 : immobile, inclinée dans l'autre sens (+2°). Avec la première, elles forment la ceinture 3 points.
function Strap2() {
  return (
    <div aria-hidden className="overflow-x-clip py-[max(1rem,2.5vw)]">
      <div className="on-red relative flex rotate-2 scale-105 justify-center gap-8 overflow-hidden bg-brand py-4">
        <Selvedge />
        {Array.from({ length: 6 }).flatMap((_, k) =>
          zones.map((z, j) => (
            <span key={`${k}-${j}`} className="flex shrink-0 items-center gap-8 font-display text-xl font-bold italic uppercase tracking-wide whitespace-nowrap sm:text-2xl">
              {z}
              <StrapBar />
            </span>
          )),
        )}
      </div>
    </div>
  )
}

export function FinalCta({ state }: { state: QuoteState }) {
  const q = computeQuote(state.formula, state.petHair, state.distance)
  const message = state.touched ? buildMessage(state) : genericMessage

  return (
    <>
      <Strap2 />

      <section id="contact" className="bg-ink px-4 pt-16 pb-28 [--surface:var(--color-ink)]">
        <div className="mx-auto max-w-[75rem] text-center">
          <h2 className="mx-auto max-w-4xl font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.04] font-bold tracking-[-0.01em] italic uppercase">
            Dites-nous où elle est garée, on&nbsp;vient.
          </h2>

          <a
            href={telLink}
            aria-label={`Appeler le ${contact.phoneDisplay}`}
            className="group relative mt-10 inline-flex items-center gap-[0.2em] font-display text-[clamp(2.25rem,10.5vw,8.5rem)] leading-none font-bold whitespace-nowrap italic outline-offset-8"
          >
            <Phone aria-hidden className="h-[0.4em] w-[0.4em] shrink-0 text-brand-light" strokeWidth={2.25} />
            <span className="relative">
              {contact.phoneDisplay}
              <span className="absolute inset-x-0 -bottom-[0.08em] [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-300 ease-out-expo group-hover:[clip-path:inset(0)] group-focus-visible:[clip-path:inset(0)]">
                <Stitch />
              </span>
            </span>
          </a>

          {state.touched && (
            <div className="mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
              <p className="text-base text-white/80">
                Votre demande&nbsp;: <span className="text-white">{summaryLine(state)}</span>
              </p>
              <p className="font-display text-2xl leading-none font-bold italic">
                {euro(q.total)}
                {q.partial && <span className="ml-1 font-sans text-sm font-normal not-italic text-mist">hors déplacement</span>}
              </p>
              <a
                href="#tarif"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('tarif')
                }}
                className="link text-sm text-white/80 hover:text-brand-light"
              >
                Modifier
              </a>
            </div>
          )}

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <CutButton href={whatsappLink(message)} target="_blank" rel="noreferrer" icon={<WhatsAppIcon className="h-5 w-5" />}>
              {state.touched ? 'Envoyer sur WhatsApp' : 'Écrire sur WhatsApp'}
            </CutButton>
            <CutButton href={smsLink(message)} variant="outline" icon={<MessageSquare aria-hidden className="h-5 w-5" />}>
              {state.touched ? 'Envoyer par SMS' : 'Envoyer un SMS'}
            </CutButton>
          </div>
          <p className="mt-6 text-base text-mist">
            Appel, SMS ou WhatsApp · <span className="whitespace-nowrap">{contact.zone}</span>
          </p>
        </div>
      </section>

      <footer className="border-t border-rule bg-ink py-10">
        <div className="mx-auto max-w-[75rem] px-4 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
            <Logo />
            <p className="text-sm text-mist">Nettoyage intérieur de voitures, à domicile ou au travail.</p>
          </div>
          <p className="mt-5 text-sm text-white/80">
            Tél.{' '}
            <a href={telLink} className="link tabular-nums">
              {contact.phoneDisplay}
            </a>{' '}
            ·{' '}
            <a href={smsLink(genericMessage)} className="link">
              SMS
            </a>{' '}
            ·{' '}
            <a href={whatsappLink(genericMessage)} target="_blank" rel="noreferrer" className="link">
              WhatsApp
            </a>{' '}
            — <span className="whitespace-nowrap">{contact.zone}</span>
          </p>
          <p className="mt-5 text-[13px] text-white/55">© {new Date().getFullYear()} CarClean · Auto-entrepreneur</p>
          {/* Placeholders à fournir par le client : aucune valeur inventée */}
          <details id="mentions" className="group/legal text-[13px] text-white/55">
            <summary className="inline-flex min-h-11 items-center gap-1.5">
              <span className="link">Mentions légales</span>
              <ChevronDown aria-hidden className="h-3.5 w-3.5 transition-transform duration-200 group-open/legal:rotate-180" />
            </summary>
            <p className="max-w-[62ch] pb-2 leading-[1.6]">{legal}</p>
          </details>
        </div>
      </footer>
    </>
  )
}
