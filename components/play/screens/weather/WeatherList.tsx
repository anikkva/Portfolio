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

/** Pragmatica · Weather list — static, as designed (cloudy 17°). */
export function WeatherList() {
  return (
    <div className={s.screen}>
      {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
      <img src={`${A}/bg-cold-overlay.png`} alt="" className={s.bg} />

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
          17°C <img src={`${A}/icon-thermometer.svg`} alt="" width={17.94} height={37} /> 42°F
        </p>
        <p className={s.row}>
          Облачно <img src={`${A}/icon-cloud.svg`} alt="" width={42.354} height={28.048} />
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

      <img src={`${A}/cloud-dots.svg`} alt="" width={226.906} height={142.515} className={s.cloud} />

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
