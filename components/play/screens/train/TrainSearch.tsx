import { StatusBar } from '@/components/play/IosChrome'
import type { ScreenProps } from '@/components/play/PlayScreen'
import { geistMono } from '@/components/play/fonts'
import { cx } from '@/lib/cx'
import s from './TrainSearch.module.css'

const A = '/play/pragmatica/train'

const TABS = ['Trains', 'Planes', 'Hotels', 'Buses']
const NAV = ['nav-search', 'nav-briefcase', 'nav-heart', 'nav-user']

/** Pragmatica · Traavel search. Hover swaps FROM and TO, the way the ⇆ button would. */
export function TrainSearch({ active }: ScreenProps) {
  return (
    <div className={cx(s.screen, geistMono.variable, active && s.swapped)}>
      {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
      <StatusBar time="9:41" />

      <div className={s.content}>
        <div className={s.topBar}>
          <p className={s.logo}>TRAAVEL</p>
          <p className={s.cashback}>Cashback 30%</p>
        </div>

        <p className={s.headline}>Where to?</p>

        <div className={s.tabs}>
          {TABS.map((tab, i) => (
            <span key={tab} className={cx(s.tab, i === 0 && s.tabActive)}>
              {tab}
            </span>
          ))}
        </div>

        <div className={s.form}>
          <div className={s.field}>
            <p className={s.label}>From</p>
            <p className={cx(s.city, s.cityFrom)}>Moscow</p>
          </div>
          <img src={`${A}/line-h.svg`} alt="" width={353} height={1} className={s.line} />
          <div className={s.swapRow}>
            <img src={`${A}/icon-swap.svg`} alt="" width={16} height={16} className={s.swapIcon} />
          </div>
          <div className={s.field}>
            <p className={s.label}>To</p>
            <p className={cx(s.city, s.cityTo)}>Saint Petersburg</p>
          </div>
          <img src={`${A}/line-h.svg`} alt="" width={353} height={1} className={s.line} />
        </div>

        <div className={s.details}>
          <div className={s.detail}>
            <p className={s.label}>Dates</p>
            <p className={s.dates}>01 MAY — 03 MAY</p>
          </div>
          <img src={`${A}/line-v.svg`} alt="" width={1} height={42} className={s.lineV} />
          <div className={cx(s.detail, s.passengers)}>
            <p className={s.label}>Passengers</p>
            <p className={s.passengersValue}>1 · ECONOMY</p>
          </div>
        </div>

        <p className={s.cta}>Find tickets</p>

        <div className={s.recent}>
          <p className={s.recentLabel}>RECENT</p>
          <div className={s.recentBody}>
            <p className={s.recentRoute}>MOSCOW → ST PETERSBURG</p>
            <div className={s.recentMeta}>
              <span className={s.recentDates}>12 MAY — 15 MAY</span>
              <span className={s.recentPrice}>from 10 605 ₽</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.nav}>
        <div className={s.navBar}>
          {NAV.map((icon) => (
            <span key={icon} className={s.navItem}>
              <img src={`${A}/${icon}.svg`} alt="" width={24} height={24} />
            </span>
          ))}
        </div>
        <div className={s.homeArea}>
          <span className={s.home} />
        </div>
      </div>
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  )
}
