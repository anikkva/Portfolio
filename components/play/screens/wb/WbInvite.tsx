import { StatusBar } from '@/components/play/IosChrome'
import type { ScreenProps } from '@/components/play/PlayScreen'
import { jetbrainsMono, unbounded } from '@/components/play/fonts'
import { cx } from '@/lib/cx'
import s from './WbInvite.module.css'

const A = '/play/pragmatica/wb'

const FRIENDS = [
  { name: 'Маша', status: 'позвала · ждём поездку', progress: '0%', avatar: 'avatar-masha.png' },
  { name: 'Тимур', status: 'поехал · дозревает', progress: '60%', avatar: 'avatar-timur.png', face: true },
  { name: 'Аня', status: '+20 000 арбузов', avatar: 'avatar-anya.png', ripe: true },
]

const NAV = [
  { label: 'Такси', icon: 'sf-car.svg', w: 24, h: 19, active: true },
  { label: 'Самокаты', icon: 'sf-scooter.svg', w: 26, h: 20 },
  { label: 'Поездки', icon: 'sf-clock.svg', w: 22, h: 20 },
  { label: 'Профиль', icon: 'sf-person.svg', w: 18, h: 19 },
]

/** Pragmatica · WB Taxi invite. Hover "copies" the promo code: the icon presses, the code flashes, a toast pops in. */
export function WbInvite({ active }: ScreenProps) {
  return (
    <div className={cx(s.screen, unbounded.variable, jetbrainsMono.variable, active && s.copied)}>
      {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
      <StatusBar time="10:41" />

      <div className={s.sheet}>
        <div className={s.hero}>
          <img src={`${A}/checkerboard.svg`} alt="" className={s.checkerboard} />
          <div className={s.face}>
            <img src={`${A}/watermelon-face.png`} alt="Watermelon mascot" />
          </div>
          <span className={s.close}>
            <img src={`${A}/sf-xmark-small.svg`} alt="" width={13} height={13} />
          </span>
          <span className={s.pillBox}>
            <span className={s.pill}>пригласи друга</span>
          </span>
        </div>

        <div className={s.offer}>
          <div className={s.headline}>
            <p className={s.amountRow}>
              <span className={s.amount}>20 000</span>
              <span className={s.flower} style={{ maskImage: `url(${A}/flower-mask.png)`, WebkitMaskImage: `url(${A}/flower-mask.png)` }} />
            </p>
            <p className={s.subtitle}>тебе и другу</p>
          </div>
          <div className={s.codeBlock}>
            <div className={s.codeCard}>
              <p className={s.code}>ARBUZ-7K2M</p>
              <span className={s.toast} aria-hidden={!active}>
                Скопировано
                <img src={`${A}/icon-check.svg`} alt="" width={12} height={12} />
              </span>
              <div className={s.codeActions}>
                <span className={s.copyIcon} aria-hidden="true">
                  <span className={s.copyBack} />
                  <span className={s.copyFront} />
                </span>
                <span className={s.share}>
                  <img src={`${A}/icon-share.svg`} alt="" width={38} height={19.976} />
                </span>
              </div>
            </div>
            <p className={s.hint}>арбузы созреют, когда друг съездит первый раз</p>
          </div>
        </div>

        <div className={s.invited}>
          <div className={s.invitedHeader}>
            <p className={s.invitedTitle}>твоя бахча</p>
            <p className={s.invitedCount}>3 зреют · 1 созрел</p>
          </div>
          <div className={s.rows}>
            {FRIENDS.map((f) => (
              <div key={f.name} className={cx(s.row, f.ripe && s.rowRipe)}>
                <div className={s.person}>
                  <span className={s.avatar}>
                    {f.face && <img src={`${A}/watermelon-face.png`} alt="" className={s.avatarFace} />}
                    <img src={`${A}/${f.avatar}`} alt="" className={s.avatarImage} />
                  </span>
                  <span className={s.personText}>
                    <span className={s.personName}>{f.name}</span>
                    <span className={cx(s.personStatus, f.ripe && s.personStatusRipe)}>{f.status}</span>
                  </span>
                </div>
                {f.ripe ? (
                  <img src={`${A}/icon-check.svg`} alt="" width={18} height={18} />
                ) : (
                  <span className={s.progress}>{f.progress}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav className={s.nav} aria-hidden="true">
        {NAV.map((item) => (
          <span key={item.label} className={cx(s.navItem, item.active && s.navItemActive)}>
            <img src={`${A}/${item.icon}`} alt="" width={item.w} height={item.h} />
            <span>{item.label}</span>
          </span>
        ))}
      </nav>
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  )
}
