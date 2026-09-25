import { Phone } from 'lucide-react'
import { telLink } from '../../lib/links'

// Toujours visible sur mobile : aucun écouteur de scroll ni rendu React pendant le défilement.
export function FloatingCall() {
  return (
    <a
      href={telLink}
      aria-label="Appeler CarClean"
      className="fixed right-4 bottom-4 z-40 grid h-16 w-16 place-items-center rounded-full bg-brand shadow-[0_10px_40px_-5px_rgba(225,6,0,0.9)] transition-transform active:scale-90 md:hidden"
    >
      <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-brand" />
      <Phone className="relative h-7 w-7" />
    </a>
  )
}
