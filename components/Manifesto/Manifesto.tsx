'use client'

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import Link from 'next/link'
import { Fragment, useRef, type ReactNode } from 'react'
import type { ManifestoToken } from '@/lib/content/schema'
import { t, type Locale } from '@/lib/i18n'
import s from './Manifesto.module.css'

type Piece = { kind: 'word'; text: string } | { kind: 'img'; src: string } | { kind: 'sym'; text: string }

function toPieces(tokens: ManifestoToken[]): Piece[] {
  return tokens.flatMap((token): Piece[] => {
    if (typeof token === 'string') {
      return token.split(/\s+/).filter(Boolean).map((text) => ({ kind: 'word', text }))
    }
    return 'img' in token ? [{ kind: 'img', src: token.img }] : [{ kind: 'sym', text: token.sym }]
  })
}

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: ReactNode }) {
  const reduced = useReducedMotion()
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span className={s.word} style={{ opacity: reduced ? 1 : opacity }}>
      {children}
    </motion.span>
  )
}

export function Manifesto({ tokens, lang }: { tokens: ManifestoToken[]; lang: Locale }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.9'] })
  const pieces = toPieces(tokens)

  return (
    <section ref={ref} className={s.manifesto}>
      <p className={s.text}>
        {pieces.map((piece, i) => (
          <Fragment key={i}>
            <Word progress={scrollYProgress} range={[i / pieces.length, (i + 1) / pieces.length]}>
              {piece.kind === 'img' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={piece.src} alt="" className={s.inlineImg} />
              ) : (
                piece.text
              )}
            </Word>{' '}
          </Fragment>
        ))}
      </p>
      <Link href={`/${lang}/about`} className="pill">
        {t(lang, 'readAboutMe')}
      </Link>
    </section>
  )
}
