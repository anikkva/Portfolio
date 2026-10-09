import type { CSSProperties } from 'react'
import type { ScreenProps } from '@/components/play/PlayScreen'
import { RollSwap } from '@/components/play/RollSwap'
import { cx } from '@/lib/cx'
import dots from './dots.json'
import s from './WeatherList.module.css'

const A = '/play/pragmatica/weather'

const STATS = [
  { icon: 'sf-humidity.svg', w: 21, h: 27, value: '34%' },
  { icon: 'sf-wind.svg', w: 25, h: 21, value: '2км/ч' },
  { icon: 'sf-thermometer.svg', w: 13, h: 27, value: '20%' },
  { icon: 'sf-aqi.svg', w: 25, h: 28, value: '80%' },
]

const HOURS = [
  ['Сейчас', '17°C'],
  ['12', '17°C'],
  ['13', '19°C'],
  ['14', '20°C'],
  ['15', '20°C'],
]

// Heat rises: the lowest dots of the cloud start moving first.
const minY = Math.min(...dots.map((d) => d.y))
const maxY = Math.max(...dots.map((d) => d.y))
const delayOf = (y: number) => (((maxY - y) / (maxY - minY)) * 0.35).toFixed(3)

/** Pragmatica · Weather list. Hover turns a cloudy 17° into a sunny 32°. */
export function WeatherList({ active }: ScreenProps) {
  return (
    <div className={cx(s.screen, active && s.hot)}>
      {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
      <img src={`${A}/bg-base.png`} alt="" className={s.bgBase} />
      <img src={`${A}/bg-cold-overlay.png`} alt="" className={s.bgCold} />

      <div className={s.statusBar} aria-hidden="true">
        <span className={s.time}>10:41</span>
        <span className={s.island} />
        <span className={s.levels}>
          <img src={`${A}/status-cellular.svg`} alt="" width={19.2} height={12.226} />
          <img src={`${A}/status-wifi.svg`} alt="" width={17.142} height={12.328} />
          <img src={`${A}/status-battery.svg`} alt="" width={27.328} height={13} />
        </span>
      </div>

      <span className={s.chevron}>
        <img src={`${A}/sf-chevron-down.svg`} alt="" width={18} height={11} />
      </span>

      <div className={s.forecast}>
        <p className={s.row}>
          Москва <img src={`${A}/icon-sunrise.svg`} alt="" width={45.526} height={31.639} />
        </p>
        <p className={s.row}>
          <img src={`${A}/icon-calendar.svg`} alt="" width={35} height={34.186} /> 24 июня Суббота
        </p>
        <p className={s.row}>
          <RollSwap from="17°C" to="32°C" active={active} delay={0.15} />
          <img src={`${A}/icon-thermometer.svg`} alt="" width={17.94} height={37} />
          <RollSwap from="42°F" to="57°F" active={active} delay={0.22} />
        </p>
        <p className={s.row}>
          <RollSwap
            active={active}
            delay={0.3}
            from={
              <>
                Облачно <img src={`${A}/icon-cloud.svg`} alt="" width={42.354} height={28.048} />
              </>
            }
            to={
              <>
                Солнечно <img src={`${A}/icon-sun.svg`} alt="" width={38.652} height={38.672} />
              </>
            }
          />
        </p>
      </div>

      <ul className={s.stats}>
        {STATS.map((stat) => (
          <li key={stat.icon} className={s.stat}>
            <span className={s.statIcon}>
              <img src={`${A}/${stat.icon}`} alt="" width={stat.w} height={stat.h} />
            </span>
            <span className={s.statValue}>{stat.value}</span>
          </li>
        ))}
      </ul>

      <svg className={s.dots} viewBox="0 0 393 852" aria-hidden="true">
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            style={
              {
                '--dx': `${d.tx - d.x}px`,
                '--dy': `${d.ty - d.y}px`,
                '--s': d.r ? d.tr / d.r : 0,
                '--delay': `${delayOf(d.y)}s`,
              } as CSSProperties
            }
          />
        ))}
      </svg>

      <ul className={s.hours}>
        {HOURS.map(([hour, temp]) => (
          <li key={hour} className={s.hour}>
            <span>{hour}</span>
            <img src={`${A}/icon-forecast-cloud.svg`} alt="" width={34.313} height={25.718} />
            <span>{temp}</span>
          </li>
        ))}
      </ul>

      <span className={s.homeIndicator} aria-hidden="true" />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  )
}
