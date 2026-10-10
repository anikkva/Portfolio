import type { ScreenProps } from '@/components/play/PlayScreen'
import { cx } from '@/lib/cx'
import shared from './Kroy.module.css'
import s from './KroyWear.module.css'
import { Icon, KroyScreen, Steps } from './parts'

const OPTIONS = [
  { label: 'Женское', on: true },
  { label: 'Мужское', on: false },
]

/** Крой · onboarding, “what do you wear”. */
export function KroyWear({ active }: ScreenProps) {
  return (
    <KroyScreen className={cx(active && s.active)}>
      <Steps step={2} total={4} />
      <div className={shared.head}>
        <p className={shared.title}>
          Что вы <em>носите</em>?
        </p>
        <p className={shared.lead}>Можно выбрать оба варианта</p>
      </div>
      <div className={s.tiles}>
        {OPTIONS.map((o) => (
          <div key={o.label} className={cx(s.tile, o.on && s.on)}>
            <span className={s.box}>{o.on && <Icon name="check" size={16} />}</span>
            {o.label}
          </div>
        ))}
        <div className={cx(s.tile, s.wide)}>
          <span className={s.box} />
          Без разделения
        </div>
      </div>
      <p className={shared.cta}>Продолжить</p>
    </KroyScreen>
  )
}
