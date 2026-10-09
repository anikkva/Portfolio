import { StatusBar } from '@/components/play/IosChrome'
import type { ScreenProps } from '@/components/play/PlayScreen'
import { unbounded } from '@/components/play/fonts'
import { cx } from '@/lib/cx'
import s from './WbPromo.module.css'

const A = '/play/pragmatica/wb'

/** Pragmatica · WB Taxi promo. While hovered, a glint keeps sweeping across the main button. */
export function WbPromo({ active }: ScreenProps) {
  return (
    <div className={cx(s.screen, unbounded.variable, active && s.active)}>
      {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
      <StatusBar time="9:41" />

      <span className={s.close}>
        <img src={`${A}/sf-xmark.svg`} alt="" width={14} height={14} />
      </span>

      <div className={s.hero}>
        <div className={s.heroCrop}>
          <img src={`${A}/watermelon-taxi.png`} alt="Watermelon taxi" className={s.heroImage} />
        </div>
      </div>

      <div className={s.content}>
        <div className={s.headline}>
          <p className={s.amount}>20 000</p>
          <p className={s.subtitle}>арбузов в подарок</p>
        </div>
        <div className={s.card}>
          <p className={s.benefit}>
            <span className={cx(s.benefitIcon, s.benefitPink)}>
              <img src={`${A}/icon-percent.svg`} alt="" width={18} height={18} />
            </span>
            −15% на первую поездку
          </p>
          <img src={`${A}/line.svg`} alt="" width={295} height={1} className={s.line} />
          <p className={s.benefit}>
            <span className={cx(s.benefitIcon, s.benefitLime)}>
              <img src={`${A}/icon-gift.svg`} alt="" width={18} height={18} />
            </span>
            20 000 арбузов после неё
          </p>
        </div>
      </div>

      <div className={s.actions}>
        <p className={s.cta}>
          <span className={s.ctaLabel}>Активировать и поехать</span>
        </p>
        <p className={s.secondary}>У меня уже есть аккаунт</p>
      </div>

      <span className={s.home} aria-hidden="true" />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  )
}
