'use client'

import { animate, useMotionValue, useMotionValueEvent } from 'motion/react'
import { useEffect, useState, type CSSProperties } from 'react'
import { StatusBar } from '@/components/play/IosChrome'
import type { ScreenProps } from '@/components/play/PlayScreen'
import { jetbrainsMono, unbounded } from '@/components/play/fonts'
import { cx } from '@/lib/cx'
import s from './WbInvite.module.css'

const A = '/play/pragmatica/wb'

const FRIENDS = [
  { name: 'Маша', status: 'позвала · ждём поездку', progress: 0, avatar: 'avatar-masha.png' },
  { name: 'Тимур', status: 'поехал · дозревает', progress: 60, avatar: 'avatar-timur.png', face: true },
  { name: 'Аня', status: '+20 000 арбузов', progress: 100, avatar: 'avatar-anya.png', ripe: true },
]

const NAV = [
  { label: 'Такси', icon: 'sf-car.svg', w: 24, h: 19, active: true },
  { label: 'Самокаты', icon: 'sf-scooter.svg', w: 26, h: 20 },
  { label: 'Поездки', icon: 'sf-clock.svg', w: 22, h: 20 },
  { label: 'Профиль', icon: 'sf-person.svg', w: 18, h: 19 },
]

/** Counts from 0 up to `to` while active, back to 0 when not. */
function Percent({ to, active }: { to: number; active: boolean }) {
  const value = useMotionValue(0)
  const [shown, setShown] = useState(0)
  useMotionValueEvent(value, 'change', (v) => setShown(Math.round(v)))
  useEffect(() => {
    const controls = animate(value, active ? to : 0, { duration: active ? 1.2 : 0.5, ease: [0.3, 0, 0.2, 1], delay: active ? 0.25 : 0 })
    return () => controls.stop()
  }, [active, to, value])
  return <span className={s.progress}>{shown}%</span>
}

/** Pragmatica · WB Taxi invite. Hover ripens the friends' rows: fills grow, Timur counts to 60%, Anya's check pops. */
export function WbInvite({ active }: ScreenProps) {
  return (
    <div className={cx(s.screen, unbounded.variable, jetbrainsMono.variable, active && s.ripening)}>
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
              <div key={f.name} className={cx(s.row, f.ripe && s.rowRipe)} style={{ '--progress': `${f.progress}%` } as CSSProperties}>
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
                  <img src={`${A}/icon-check.svg`} alt="" width={18} height={18} className={s.check} />
                ) : (
                  <Percent to={f.progress} active={active} />
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
