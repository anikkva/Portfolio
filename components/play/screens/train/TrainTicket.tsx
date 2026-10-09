import { DotNumber } from '@/components/play/DotNumber'
import { StatusBar } from '@/components/play/IosChrome'
import type { ScreenProps } from '@/components/play/PlayScreen'
import { dmMono, geist, geistMono } from '@/components/play/fonts'
import { cx } from '@/lib/cx'
import numberDots from './numberDots.json'
import { SeatMapLayer, seatMapStyles } from './TrainSeat'
import s from './TrainTicket.module.css'

const A = '/play/pragmatica/train'

const SPECS = [
  ['Window', 'near'],
  ['Outlet', 'at seat'],
  ['Berth', 'lower'],
]

/** Pragmatica · Traavel ticket. Hover flips the stamp up over its top edge and reveals the seat details. */
export function TrainTicket({ active }: ScreenProps) {
  return (
    <div className={cx(s.screen, geist.variable, geistMono.variable, dmMono.variable, active && s.flipped)}>
      {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
      <div className={cx(seatMapStyles.screen, s.backdrop)} aria-hidden="true">
        <SeatMapLayer />
      </div>
      <span className={s.dim} />
      <img src={`${A}/ticket-glow.svg`} alt="" className={cx(s.glow, s.glowBottom)} />
      <img src={`${A}/ticket-glow.svg`} alt="" className={cx(s.glow, s.glowTop)} />

      <div className={s.stage}>
        <img src={`${A}/ticket-stamp.png`} alt="Train ticket stamp" className={s.stamp} />
      </div>

      <div className={s.front}>
        <p className={s.title}>Your ticket</p>
        <p className={s.tag}>CB / LUX</p>
        <span className={s.badge}>
          <img src={`${A}/seat-badge-ring.svg`} alt="" width={38} height={38} />
          <span>23</span>
        </span>
      </div>

      <div className={s.back}>
        <StatusBar time="9:41" />
        <div className={s.details}>
          <div className={s.noise}>
            <DotNumber glyph={numberDots['82']} width={106} height={69} />
            <p className={s.noiseLabel}>
              <span>Noise Index</span>
              <span className={s.noiseScale}>/ 100</span>
            </p>
          </div>
          <div className={s.specs}>
            {SPECS.map(([key, value], i) => (
              <p key={key} className={cx(s.spec, i > 0 && s.specRule)}>
                <span className={s.specKey}>{key}</span>
                <span className={s.specValue}>{value}</span>
              </p>
            ))}
          </div>
          <p className={s.select}>Select · 3 219 ₽</p>
        </div>
      </div>
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  )
}
