import { DM_Mono, Geist, Geist_Mono, Inter, JetBrains_Mono, Oswald, Playfair_Display, Unbounded } from 'next/font/google'

/** Geist, Geist Mono, DM Mono (Traavel), Unbounded and JetBrains Mono (WB Taxi) — all OFL. */
export const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-geist' })
export const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-geist-mono' })
export const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-dm-mono' })
export const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], weight: ['900'], variable: '--font-unbounded' })
export const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['700'], variable: '--font-jetbrains-mono' })

/** Крой (own concept): Oswald wordmark, Inter text, Playfair Display italic accents — all OFL, with Cyrillic. */
export const oswald = Oswald({ subsets: ['latin', 'cyrillic'], weight: ['600'], variable: '--font-oswald' })
export const inter = Inter({ subsets: ['latin', 'cyrillic'], weight: ['400', '500'], variable: '--font-inter' })
export const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], weight: ['400'], style: ['italic'], variable: '--font-playfair' })
