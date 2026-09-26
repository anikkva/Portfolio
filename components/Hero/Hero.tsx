'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { InkText } from '@/components/ink/InkText'
import { useMotionAllowed } from '@/lib/useMotionAllowed'
import s from './Hero.module.css'

export function Hero({ name }: { name: string }) {
  const ref = useRef<HTMLElement>(null)
  const allowed = useMotionAllowed()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 160])
  return (
    <section ref={ref} className={s.hero}>
      <div className={s.plate}>
        <motion.div style={{ y: allowed ? y : 0 }}>
          <InkText as="h1" className={s.title}>
            {name.toLowerCase()}
          </InkText>
        </motion.div>
      </div>
    </section>
  )
}
