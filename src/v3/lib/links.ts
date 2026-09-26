import { contact } from '../data/content'

export const telLink = `tel:${contact.phoneIntl}`
export const smsLink = (body = 'Bonjour CarClean ! Je souhaite prendre rendez-vous.') =>
  `sms:${contact.phoneIntl}?&body=${encodeURIComponent(body)}`
export const whatsappLink = (text = 'Bonjour CarClean ! Je souhaite prendre rendez-vous.') =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`
