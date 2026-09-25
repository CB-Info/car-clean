import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Variantes responsive d'une image Unsplash (le paramètre `w` fixe la largeur servie).
export const unsplashSrcSet = (url: string, widths: number[]) =>
  widths.map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`).join(', ')
