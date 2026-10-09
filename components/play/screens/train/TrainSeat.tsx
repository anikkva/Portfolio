import type { CSSProperties } from 'react'
import { DotNumber } from '@/components/play/DotNumber'
import { StatusBar } from '@/components/play/IosChrome'
import type { ScreenProps } from '@/components/play/PlayScreen'
import { geist, geistMono } from '@/components/play/fonts'
import { cx } from '@/lib/cx'
import numberDots from './numberDots.json'
import s from './TrainSeat.module.css'

const A = '/play/pragmatica/train'

const LOUD = '255,107,74'
const MID = '122,106,85'
const QUIET = '78,205,196'

/** A seat's noise tint: rgb, border alpha, glow alpha at the centre. `null` = taken. */
type Seat = { n: number; tone?: string; border?: number; glow?: number; selected?: boolean } | null
const seat = (n: number, tone: string, border: number, glow: number): Seat => ({ n, tone, border, glow })
const taken = (n: number) => ({ n })

const ROWS: { row: number; seats: [Seat | { n: number }, Seat | { n: number }, Seat | { n: number }, Seat | { n: number }] }[] = [
  { row: 1, seats: [seat(1, LOUD, 0.19, 0.251), seat(2, LOUD, 0.25, 0.314), taken(3), seat(4, LOUD, 0.19, 0.251)] },
  { row: 2, seats: [seat(9, MID, 0.19, 0.251), seat(10, MID, 0.19, 0.251), seat(11, MID, 0.15, 0.208), taken(12)] },
  { row: 3, seats: [seat(21, QUIET, 0.19, 0.251), seat(22, QUIET, 0.25, 0.314), { n: 23, selected: true }, seat(24, QUIET, 0.19, 0.251)] },
  { row: 4, seats: [seat(25, QUIET, 0.25, 0.333), taken(26), seat(27, QUIET, 0.19, 0.251), seat(28, QUIET, 0.19, 0.251)] },
  { row: 5, seats: [seat(33, LOUD, 0.27, 0.333), taken(34), seat(35, LOUD, 0.25, 0.314), seat(36, LOUD, 0.31, 0.376)] },
]

function SeatDot({ seat }: { seat: Seat | { n: number } }) {
  if (!seat) return null
  if ('selected' in seat && seat.selected) return <span className={cx(s.seat, s.seatSelected)}>{seat.n}</span>
  if (!('tone' in seat) || !seat.tone) return <span className={cx(s.seat, s.seatTaken)}>{seat.n}</span>
  const style = {
    borderColor: `rgba(${seat.tone},${seat.border})`,
    backgroundImage: `radial-gradient(closest-side, rgba(${seat.tone},${seat.glow}) 0%, rgba(${seat.tone},${(seat.glow! / 4).toFixed(3)}) 70%, rgba(14,14,16,0) 100%)`,
  } as CSSProperties
  return (
    <span className={s.seat} style={style}>
      {seat.n}
    </span>
  )
}

/** Pragmatica · Traavel seat map. Hover makes the noise index's dots scatter and gather back into 82. */
export function TrainSeat({ active }: ScreenProps) {
  return (
    <div className={cx(s.screen, geist.variable, geistMono.variable)}>
      {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
      <StatusBar time="9:41" />

      <div className={s.content}>
        <div className={s.topNav}>
          <span className={s.back}>
            <img src={`${A}/icon-chevron-left.svg`} alt="" width={16} height={16} />
          </span>
          <p className={s.route}>Moscow → St Petersburg</p>
          <p className={s.tag}>CAR 08 / 12</p>
        </div>

        <div className={s.header}>
          <p className={s.title}>Choose your seat</p>
          <p className={cx(s.tag, s.tagLarge)}>CB / LUX</p>
        </div>

        <div className={s.chips}>
          <span className={cx(s.chip, s.chipActive)}>Noise</span>
          <span className={s.chip}>Temp</span>
          <span className={s.chip}>Outlets</span>
          <span className={s.chip}>Neighbors</span>
        </div>

        <div className={s.legend}>
          <span className={s.loud}>Loud</span>
          <span className={s.legendBar} />
          <span className={s.quiet}>Quiet</span>
          <span className={s.scaleNote}>Scale: 0-100</span>
        </div>

        <div className={s.schematic}>
          <div className={s.cols}>
            <span>A1</span>
            <span>A2</span>
            <span>B1</span>
            <span>B2</span>
          </div>
          <p className={s.direction}>
            <img src={`${A}/icon-arrow-right.svg`} alt="" width={10} height={10} /> Direction of Travel
          </p>
          <div className={s.car}>
            <p className={s.vestibule}>Vestibule</p>
            {ROWS.map(({ row, seats }, i) => (
              <div key={row} className={cx(s.row, i > 0 && s.rowRule)}>
                <span className={s.rowNumber}>{row}</span>
                <span className={s.pair}>
                  <SeatDot seat={seats[0]} />
                  <SeatDot seat={seats[1]} />
                </span>
                <span className={s.aisle} />
                <span className={s.pair}>
                  <SeatDot seat={seats[2]} />
                  <SeatDot seat={seats[3]} />
                </span>
                <span className={s.rowNumber} />
              </div>
            ))}
            <p className={s.boiler}>Boiler</p>
          </div>
        </div>
      </div>

      <div className={s.card}>
        <img src={`${A}/card-glow.svg`} alt="" width={613} height={506.82} className={s.glow} />
        <div className={s.cardTop}>
          <div className={s.noise}>
            <DotNumber glyph={numberDots['82']} width={106} height={69} assemble={active} />
            <div className={s.noiseLabel}>
              <span>Noise Index</span>
              <span className={s.noiseScale}>/ 100</span>
            </div>
          </div>
          <div className={s.seatNo}>
            <DotNumber glyph={numberDots['23']} width={55} height={36} />
            <span className={s.seatLabel}>Seat</span>
          </div>
        </div>
        <div className={s.specs}>
          {[
            ['Window', 'near'],
            ['Outlet', 'at seat'],
            ['Berth', 'lower'],
          ].map(([key, value], i) => (
            <p key={key} className={cx(s.spec, i > 0 && s.specRule)}>
              <span className={s.specKey}>{key}</span>
              <span>{value}</span>
            </p>
          ))}
        </div>
        <p className={s.select}>Select · 3 219 ₽</p>
      </div>
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  )
}
