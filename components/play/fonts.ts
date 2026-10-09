import { DM_Mono, Geist, Geist_Mono, JetBrains_Mono, Unbounded } from 'next/font/google'

/** Geist, Geist Mono, DM Mono (Traavel), Unbounded and JetBrains Mono (WB Taxi) — all OFL. */
export const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-geist' })
export const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-geist-mono' })
export const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-dm-mono' })
export const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], weight: ['900'], variable: '--font-unbounded' })
export const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['700'], variable: '--font-jetbrains-mono' })
