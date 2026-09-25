import { MessageSquare, Phone } from 'lucide-react'
import { ShimmerButton } from '../magicui/shimmer-button'
import { Reveal } from '../ui/reveal'
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '../ui/brand-icons'
import { Logo } from '../ui/logo'
import { contact } from '../../data/content'
import { smsLink, telLink, whatsappLink } from '../../lib/links'

export function FinalCta() {
  return (
    <>
      <section id="contact" className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-brand-dark/40 to-ink" />
        <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(100deg,transparent_0_60px,rgba(255,255,255,0.025)_60px_62px)]" />

        <Reveal className="relative mx-auto max-w-4xl text-center">
          <h2 className="font-display text-[clamp(1.75rem,8.5vw,2.25rem)] text-balance leading-[1.02] font-bold italic uppercase sm:text-6xl lg:text-7xl">
            Prêt à retrouver une voiture <span className="text-gradient-red">impeccable</span> ?
          </h2>
          <a
            href={telLink}
            className="mt-10 inline-flex items-center gap-4 font-display text-4xl font-bold italic tracking-wide transition-transform duration-300 hover:scale-[1.03] sm:text-6xl"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand shadow-[0_0_0_8px_rgba(225,6,0,0.2)] sm:h-16 sm:w-16">
              <Phone className="h-7 w-7" />
            </span>
            {contact.phoneDisplay}
          </a>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ShimmerButton href={whatsappLink()} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </ShimmerButton>
            <ShimmerButton variant="ghost" href={smsLink()}>
              <MessageSquare className="h-5 w-5" /> Envoyer un SMS
            </ShimmerButton>
          </div>
          <p className="mt-8 text-sm text-white/55">Prenez rendez-vous dès maintenant · Réponse rapide</p>
        </Reveal>
      </section>

      <footer className="border-t border-white/10 px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <Logo />
            <p className="mt-1 text-xs uppercase tracking-widest text-mist">Service de nettoyage automobile à domicile</p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { href: contact.tiktok.url, Icon: TikTokIcon, label: 'TikTok' },
              { href: contact.instagram.url, Icon: InstagramIcon, label: 'Instagram' },
              { href: whatsappLink(), Icon: WhatsAppIcon, label: 'WhatsApp' },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 transition-colors hover:border-brand hover:bg-brand">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-white/55 sm:text-left">
          © {new Date().getFullYear()} CarClean · Auto-entrepreneur · Mentions légales
        </p>
      </footer>
    </>
  )
}
