import { MessageSquare } from 'lucide-react'
import { SlantButton } from '../ui/slant-button'
import { WhatsAppIcon } from '../ui/brand-icons'
import { Logo } from '../ui/logo'
import { contact, legal } from '../../data/content'
import { buildMessage, phoneRecap, type QuoteState } from '../../lib/message'
import { scrollToId } from '../../lib/smooth-scroll'
import { smsLink, telLink, whatsappLink } from '../../lib/links'

type Props = { state: QuoteState; touched: boolean }

// La bande de livrée rouge : le seul moment « couleur pleine » de la page, qui porte le numéro géant.
export function FinalCta({ state, touched }: Props) {
  const message = touched ? buildMessage(state) : undefined

  return (
    <>
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="on-red relative bg-brand py-[calc(var(--tape-rise)+5rem)] text-white [clip-path:polygon(0_var(--tape-rise),100%_0,100%_calc(100%-var(--tape-rise)),0_100%)] lg:py-[calc(var(--tape-rise)+7rem)]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2
            id="contact-title"
            className="font-display text-[clamp(2rem,8vw,2.5rem)] leading-[0.98] font-bold tracking-[-0.01em] italic uppercase sm:text-5xl lg:text-6xl"
          >
            Dites-nous où et quand, on vient.
          </h2>

          <a
            href={telLink}
            aria-label={`Appeler le ${contact.phoneDisplay}`}
            className="mt-8 inline-block font-display text-[clamp(2.5rem,11.5vw,9rem)] leading-none font-bold whitespace-nowrap italic decoration-ink decoration-4 underline-offset-[0.12em] hover:underline"
          >
            {contact.phoneDisplay}
          </a>

          {touched && (
            <p className="mt-8 text-[17px] text-white">
              Votre demande : <strong className="font-semibold text-white">{phoneRecap(state)}</strong>{' '}
              <a
                href="#tarif"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('tarif')
                }}
                className="text-link ml-1 text-white"
              >
                Modifier
              </a>
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <SlantButton variant="onRed" size="lg" href={whatsappLink(message)} target="_blank" rel="noreferrer" className="max-sm:mx-1.5 max-sm:flex">
              <WhatsAppIcon className="h-5 w-5" /> {touched ? 'Envoyer sur WhatsApp' : 'Écrire sur WhatsApp'}
            </SlantButton>
            <SlantButton variant="onRedGhost" size="lg" href={smsLink(message)} className="max-sm:mx-1.5 max-sm:flex">
              <MessageSquare aria-hidden className="h-5 w-5" /> {touched ? 'Envoyer par SMS' : 'Envoyer un SMS'}
            </SlantButton>
          </div>

          <p className="mt-6 text-sm text-white">Appel, SMS ou WhatsApp · {contact.zone}</p>
        </div>
      </section>

      <footer className="bg-ink py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div>
              <Logo />
              <p className="mt-2 text-sm text-white/60">Nettoyage intérieur de voiture, chez vous ou au travail.</p>
            </div>
            <div className="text-sm sm:text-right">
              {/* Cibles tactiles d'au moins 44 px de haut, même pour ces liens texte */}
              <p className="flex flex-wrap items-center gap-x-3 text-white/85 sm:justify-end">
                <a href={telLink} className="text-link inline-flex min-h-11 items-center whitespace-nowrap tabular-nums">
                  Tél. {contact.phoneDisplay}
                </a>
                <span aria-hidden className="text-white/30">
                  ·
                </span>
                <a href={smsLink()} className="text-link inline-flex min-h-11 min-w-11 items-center justify-center">
                  SMS
                </a>
                <span aria-hidden className="text-white/30">
                  ·
                </span>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className="text-link inline-flex min-h-11 items-center">
                  WhatsApp
                </a>
              </p>
              <p className="text-white/60">{contact.zone}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-2 text-[13px] text-white/55">
            <span>© {new Date().getFullYear()} CarClean · Auto-entrepreneur ·</span>
            <details className="group">
              <summary className="inline-flex min-h-11 items-center underline underline-offset-[0.22em] transition-colors hover:text-white">Mentions légales</summary>
              <p className="mt-1 mb-2 max-w-[62ch] text-white/70">{legal}</p>
            </details>
          </div>
        </div>
      </footer>
    </>
  )
}
