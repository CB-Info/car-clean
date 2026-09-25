import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '../ui/section-heading'
import { Reveal } from '../ui/reveal'
import { InstagramIcon, TikTokIcon } from '../ui/brand-icons'
import { contact, images } from '../../data/content'

const cards = [
  { name: 'TikTok', handle: contact.tiktok.handle, url: contact.tiktok.url, Icon: TikTokIcon, img: images.foam, text: 'Les transformations en vidéo' },
  { name: 'Instagram', handle: contact.instagram.handle, url: contact.instagram.url, Icon: InstagramIcon, img: images.spray, text: 'Photos avant / après' },
]

export function Socials() {
  return (
    <section className="px-4 py-20 sm:py-24">
      <SectionHeading
        eyebrow="Suivez-nous"
        title="Nos transformations en direct"
        highlight="transformations"
        subtitle="Des avant / après bluffants en photo et en vidéo. Vous pouvez aussi réserver en message privé."
      />
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2">
        {cards.map(({ name, handle, url, Icon, img, text }, i) => (
          <Reveal key={name} delay={i * 0.08}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 sm:aspect-[16/10]"
          >
            <img src={img} alt="" loading="lazy" decoding="async" width={900} height={600} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            <div className="absolute inset-0 bg-brand/0 mix-blend-multiply transition-colors duration-500 group-hover:bg-brand/30" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 sm:p-8">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur transition-colors duration-300 group-hover:bg-brand">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm text-white/70">{text}</p>
                <p className="font-display text-2xl font-bold italic sm:text-3xl">{handle}</p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
