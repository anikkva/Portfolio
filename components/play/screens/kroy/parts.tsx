import type { ReactNode } from 'react'
import { HomeIndicator, StatusBar } from '@/components/play/IosChrome'
import { inter, oswald, playfair } from '@/components/play/fonts'
import { cx } from '@/lib/cx'
import s from './Kroy.module.css'

/** Light iPhone frame with the Крой fonts wired in. */
export function KroyScreen({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx(s.screen, inter.variable, oswald.variable, playfair.variable, className)}>
      <StatusBar time="9:41" dark />
      {children}
      <HomeIndicator dark />
    </div>
  )
}

/** Onboarding top bar: back arrow, “step N of total” and a hairline progress. */
export function Steps({ step, total }: { step: number; total: number }) {
  return (
    <>
      <div className={s.top}>
        <Icon name="back" />
        <span className={s.step}>
          {step} из {total}
        </span>
      </div>
      <div className={s.progress}>
        <span style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </>
  )
}

const PATHS = {
  back: 'M15 5l-7 7 7 7',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
} as const

/** 24 px line icons, drawn for this concept. */
export function Icon({ name, filled = false, size = 24 }: { name: keyof typeof PATHS; filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={PATHS[name]}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
