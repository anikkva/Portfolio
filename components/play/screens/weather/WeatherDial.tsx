'use client'

import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useState } from 'react'
import { HomeIndicator, StatusBar } from '@/components/play/IosChrome'
import type { ScreenProps } from '@/components/play/PlayScreen'
import s from './WeatherDial.module.css'

const A = '/play/pragmatica/weather'

/** A frosty winter day in Moscow, °C by hour — always below zero, so the minus never jumps. */
const DAY: Record<number, number> = { 5: -9, 6: -8, 7: -8, 8: -7, 9: -6, 10: -5, 11: -4, 12: -3, 13: -2, 14: -2, 15: -3, 16: -4 }
const HOURS = Object.keys(DAY).map(Number)
const START = 8 // −7° at rest
const END = 13 // hover scrolls the morning up to −2°

const tempAt = (hour: number) => {
  const lo = Math.floor(hour)
  const hi = Math.min(lo + 1, HOURS[HOURS.length - 1])
  return DAY[lo] + (DAY[hi] - DAY[lo]) * (hour - lo)
}
const formatTemp = (t: number) => `${t}`

/** Piecewise-linear fade by distance from the marker (0, 1, 2, 3 slots away). */
const fade = (k: number, steps: number[]) => {
  const d = Math.min(Math.abs(k), steps.length - 1)
  const i = Math.floor(d)
  return i >= steps.length - 1 ? steps[steps.length - 1] : steps[i] + (steps[i + 1] - steps[i]) * (d - i)
}

/**
 * One hour on the dial: the label rides an arc measured from the Figma layout
 * (≈96 px apart, dropping ≈3.9·(k² + |k|) px, tilted 5° per slot).
 */
function Slot({ hour, offset }: { hour: number; offset: MotionValue<number> }) {
  const k = useTransform(offset, (o) => hour - o)
  const hourStyle = {
    x: useTransform(k, (v) => 96.5 * v),
    y: useTransform(k, (v) => 3.9 * (v * v + Math.abs(v))),
    rotate: useTransform(k, (v) => 5 * v),
    skewX: useTransform(k, (v) => -2.3 * v),
    opacity: useTransform(k, (v) => fade(v, [0.5, 0.24, 0.12, 0.06, 0])),
  }
  const tempStyle = {
    x: useTransform(k, (v) => 90 * v),
    y: useTransform(k, (v) => 3.5 * v * v + 2 * Math.abs(v)),
    rotate: useTransform(k, (v) => 4.5 * v),
    skewX: useTransform(k, (v) => -2.1 * v),
    opacity: useTransform(k, (v) => fade(v, [1, 0.2, 0.12, 0.06, 0])),
  }
  return (
    <>
      <motion.span className={s.hour} style={hourStyle}>
        {String(hour).padStart(2, '0')}:00
      </motion.span>
      <motion.span className={s.temp} style={tempStyle}>
        {formatTemp(DAY[hour])}°
      </motion.span>
    </>
  )
}

/** Pragmatica · Weather dial. Hover scrolls the day; the big number and the background follow the temperature. */
export function WeatherDial({ active }: ScreenProps) {
  const hour = useMotionValue(START)
  const [temp, setTemp] = useState(DAY[START])
  // Warmer hours let a little of the orange base show through the icy layer.
  const coldOpacity = useTransform(hour, (h) => 1 - Math.min(Math.max((tempAt(h) + 7) / 5, 0), 1) * 0.1)

  useMotionValueEvent(hour, 'change', (h) => setTemp(DAY[Math.round(h)]))

  useEffect(() => {
    const controls = active
      ? animate(hour, END, { duration: 3, ease: [0.45, 0, 0.2, 1] })
      : animate(hour, START, { duration: 1.2, ease: [0.45, 0, 0.2, 1] })
    return () => controls.stop()
  }, [active, hour])

  return (
    <div className={s.screen}>
      {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
      <motion.img src={`${A}/bg-cold-overlay.png`} alt="" className={s.bg} style={{ opacity: coldOpacity }} />

      <StatusBar time="18:41" />

      <p className={s.city}>Москва</p>
      <p className={`${s.city} ${s.cityNext}`}>Ростов-на-Дону</p>

      <div className={s.now}>
        <span key={temp} className={s.nowValue}>
          {formatTemp(temp)}
        </span>
        <img src={`${A}/sf-snowflake.svg`} alt="" width={43} height={47} className={s.snowflake} />
      </div>

      <div className={s.name}>
        <p className={s.nameTitle}>Ледяное стекло</p>
        <p className={s.nameHex}>#FF0000</p>
      </div>

      <div className={s.rgb}>
        <span className={s.channel}>
          R <img src={`${A}/sf-humidity-small.svg`} alt="" width={16} height={21} /> <span className={s.channelValue}>34%</span>
        </span>
        <span className={s.channel}>
          G <img src={`${A}/sf-wind-small.svg`} alt="" width={18} height={16} /> <span className={s.channelValue}>2км/ч</span>
        </span>
        <span className={s.channel}>
          B <img src={`${A}/sf-thermometer-small.svg`} alt="" width={10} height={20} /> <span className={s.channelValue}>20%</span>
        </span>
      </div>

      <div className={s.scale} aria-hidden="true">
        <span className={s.scaleLabel} style={{ left: 360, top: 223 }}>50°</span>
        <span className={s.scaleLabel} style={{ left: 304.19, top: 402 }}>50°</span>
        <span className={s.scaleLabel} style={{ left: 357, top: 595 }}>-15°</span>
        {[
          [332.26, 421.86, 40.854],
          [352.68, 400.21, 20.426],
          [352.68, 444.16, 20.426],
          [362.9, 379.19, 10.213],
          [362.9, 465.18, 10.213],
          [368, 326, 5.105],
          [368, 356.26, 5.105],
          [368, 487, 5.105],
          [368, 519.48, 5.105],
        ].map(([left, top, width]) => (
          <span key={`${left}-${top}`} className={s.tick} style={{ left, top, width }} />
        ))}
      </div>

      <div className={s.dial}>
        <img src={`${A}/dial-arc.svg`} alt="" className={s.arc} />
        <span className={s.marker} />
        {HOURS.map((h) => (
          <Slot key={h} hour={h} offset={hour} />
        ))}
      </div>

      <HomeIndicator />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  )
}
