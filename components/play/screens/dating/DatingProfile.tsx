import type { CSSProperties } from 'react'
import { StatusBar } from '@/components/play/IosChrome'
import type { ScreenProps } from '@/components/play/PlayScreen'
import { cx } from '@/lib/cx'
import doodles from './doodles.json'
import s from './DatingProfile.module.css'

const A = '/play/pragmatica/dating'

type DoodleName = keyof typeof doodles

/** A hand-drawn doodle whose strokes redraw one after another while `draw` is set. */
function Doodle({ name, delay }: { name: DoodleName; delay: number }) {
  const { viewBox, paths } = doodles[name]
  const [, , w, h] = viewBox.split(' ').map(Number)
  return (
    <svg width={w} height={h} viewBox={viewBox} fill="none" className={s.doodle} aria-hidden="true">
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke ?? undefined}
          strokeWidth={p.width}
          strokeLinecap={(p.cap as 'round') ?? 'round'}
          strokeLinejoin="round"
          pathLength={1}
          style={{ '--draw-delay': `${(delay + (i / paths.length) * 0.6).toFixed(3)}s` } as CSSProperties}
        />
      ))}
    </svg>
  )
}

/** One folder cut from the shared sprite; `crop` is the sprite's offset inside the folder box, in %. */
type Folder = { left: number; top: number; box: [number, number]; size: [number, number]; rotate: number; crop: [number, number] }
const FOLDERS: Folder[] = [
  { left: -0.46, top: 197.5, box: [141.92, 126.6], size: [137, 121], rotate: 2.39, crop: [-18.63, -25.7] },
  { left: 143, top: 202.5, box: [115, 101], size: [115, 101], rotate: 0, crop: [-116.56, -25.7] },
  { left: 278, top: 206.5, box: [121.436, 108.75], size: [113, 99], rotate: 5.15, crop: [-218.77, -25.7] },
  { left: 76.87, top: 347.08, box: [109.264, 97.842], size: [105, 93], rotate: 2.7, crop: [-18.63, -139.07] },
  { left: 211, top: 346.5, box: [107.531, 96.162], size: [103, 91], rotate: -2.94, crop: [-116.46, -139.07] },
  { left: 278.23, top: 488, box: [102.547, 91.059], size: [99, 87], rotate: -2.39, crop: [-217.41, -139.07] },
  { left: 15, top: 499, box: [99, 87], size: [99, 87], rotate: 0, crop: [-18.63, -253.49] },
  { left: 139, top: 492, box: [111, 98], size: [111, 98], rotate: 0, crop: [-116, -253.49] },
]

const LABELS: { text: string; left: number; top: number; box: [number, number]; rotate: number }[] = [
  { text: 'стиль', left: 46, top: 311.3, box: [34.676, 15.734], rotate: 2.95 },
  { text: 'школа', left: 181, top: 296.5, box: [38.045, 14.124], rotate: -0.19 },
  { text: 'животные', left: 300.22, top: 301.38, box: [62.039, 19.623], rotate: 5.35 },
  { text: 'музыка', left: 103, top: 473, box: [45.599, 16.063], rotate: 2.65 },
  { text: 'дождь', left: 249, top: 471, box: [42.786, 16.572], rotate: -3.55 },
]

/** Reactions cut from the sprite: box size, then sprite size and offset (all from Figma, in %). */
const REACTIONS: { w: number; h: number; img: [number, number, number, number]; count: number }[] = [
  { w: 68.904, h: 67.985, img: [320, 576.58, -10.67, -13.96], count: 12 },
  { w: 68.904, h: 67.985, img: [320, 576.58, -8.78, -329.24], count: 2 },
  { w: 68.904, h: 60.635, img: [299.15, 604.35, -104.56, -23.88], count: 5 },
  { w: 64.31, h: 67.985, img: [320.52, 539.01, -220.09, -11.74], count: 4 },
  { w: 68.904, h: 67.985, img: [299.15, 539.01, -198.75, -107.92], count: 2 },
]

/** Pragmatica · Dating profile. Hover redraws the doodles stroke by stroke. */
export function DatingProfile({ active }: ScreenProps) {
  return (
    <div className={cx(s.screen, active && s.active)}>
      {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
      <div className={s.page}>
        <img src={`${A}/photo.png`} alt="Profile photo" className={s.photo} />
        <img src={`${A}/photo.png`} alt="" className={cx(s.photo, s.photoMirror)} />

        <span className={cx(s.roundButton, s.message)}>
          <img src={`${A}/sf-message.svg`} alt="" width={22} height={19} />
        </span>
        <img src={`${A}/title.svg`} alt="Кейт, 26" width={136} height={53} className={s.title} />
        <span className={cx(s.roundButton, s.shuffle)}>
          <img src={`${A}/sf-shuffle.svg`} alt="" width={22} height={18} />
        </span>

        <div className={s.friends} aria-hidden="true">
          <span className={s.cardA}>
            <span className={s.card}>
              <img src={`${A}/friend-1.png`} alt="" className={s.cardImageA} />
            </span>
          </span>
          <span className={s.cardB}>
            <span className={s.card}>
              <img src={`${A}/friend-2.png`} alt="" className={s.cardImageB} />
            </span>
          </span>
          <span className={cx(s.card, s.cardC)}>
            <img src={`${A}/friend-3.png`} alt="" className={s.cardImageC} />
          </span>
        </div>

        <div className={s.sheet}>
          <div className={s.reactionsHeader}>
            <img src={`${A}/heading-reactions.svg`} alt="Реакции друзей" width={143} height={23} />
            <img src={`${A}/icon-plus.svg`} alt="" width={24} height={24} />
          </div>

          <div className={s.reactions}>
            {REACTIONS.map((r, i) => (
              <span key={i} className={s.reaction} style={{ width: r.w, height: r.h }}>
                <img
                  src={`${A}/reactions.png`}
                  alt=""
                  style={{ width: `${r.img[0]}%`, height: `${r.img[1]}%`, left: `${r.img[2]}%`, top: `${r.img[3]}%` }}
                />
              </span>
            ))}
            <span className={s.badges}>
              {REACTIONS.map((r, i) => (
                <span key={i} className={s.badge}>
                  {r.count}
                </span>
              ))}
            </span>
          </div>

          <img src={`${A}/heading-vibe.svg`} alt="Общий вайб" width={113} height={21} className={s.vibeHeading} />

          <span className={s.place} style={{ left: 165.9, top: 313.74 }}>
            <Doodle name="sun" delay={0.15} />
          </span>
          <span className={s.place} style={{ left: 276.28, top: 313.78 }}>
            <Doodle name="flower" delay={0.3} />
          </span>
          <span className={s.placeCenter} style={{ left: -5, top: 321.5, width: 116.159, height: 144.176, rotate: '-6.05deg' }}>
            <Doodle name="guitar" delay={0.25} />
          </span>
          <span className={s.place} style={{ left: 126.5, top: 315 }}>
            <Doodle name="heart" delay={0.05} />
          </span>

          {FOLDERS.map((f, i) => (
            <span
              key={i}
              className={s.placeCenter}
              style={{ left: f.left, top: f.top, width: f.box[0], height: f.box[1], rotate: `${f.rotate}deg` }}
            >
              <span
                className={s.folder}
                style={{ width: f.size[0], height: f.size[1] }}
              >
                <img src={`${A}/folders.png`} alt="" style={{ left: `${f.crop[0]}%`, top: `${f.crop[1]}%` }} />
              </span>
            </span>
          ))}

          {LABELS.map((l) => (
            <span
              key={l.text}
              className={cx(s.placeCenter, s.label)}
              style={{ left: l.left, top: l.top, width: l.box[0], height: l.box[1], rotate: `${l.rotate}deg` }}
            >
              {l.text}
            </span>
          ))}

          <span className={s.placeCenter} style={{ left: 205, top: 177.5, width: 97.363, height: 54.656, rotate: '-6.36deg' }}>
            <Doodle name="dino" delay={0} />
          </span>
          <span className={s.placeCenter} style={{ left: 124, top: 234.66, width: 33, height: 34.017, rotate: '-51.16deg' }}>
            <Doodle name="arrow" delay={0.1} />
          </span>

        </div>
      </div>

      <span className={s.fade} />

      <StatusBar time="10:41" />

      <div className={s.actions}>
        <span className={s.dislike}>
          <img src={`${A}/sf-heart-slash.svg`} alt="" width={36} height={34} />
        </span>
        <img src={`${A}/button-like.svg`} alt="" width={125} height={80} />
      </div>
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  )
}
