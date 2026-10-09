import { DM_Mono, Geist, Geist_Mono } from 'next/font/google'

/** Geist, Geist Mono and DM Mono (all OFL) — the Traavel screens' type. */
export const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-geist' })
export const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-geist-mono' })
export const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-dm-mono' })
