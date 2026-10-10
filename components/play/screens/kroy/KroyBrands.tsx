import type { ScreenProps } from '@/components/play/PlayScreen'
import { cx } from '@/lib/cx'
import shared from './Kroy.module.css'
import s from './KroyBrands.module.css'
import { Icon, KroyScreen, Steps } from './parts'

const BRANDS = ['12 STOREEZ', 'Ushatava', 'Lime', 'Love Republic', 'Charuel', 'Gate31', 'Choux', 'Zarina', 'Befree']
const LIKED = new Set(['12 STOREEZ', 'Ushatava'])

/** Крой · onboarding, favourite brands. */
export function KroyBrands({ active }: ScreenProps) {
  return (
    <KroyScreen className={cx(active && s.active)}>
      <Steps step={3} total={4} />
      <div className={shared.head}>
        <p className={shared.title}>
          Выберите 3 <em>бренда</em>
        </p>
        <p className={shared.lead}>Те, что уже есть в&nbsp;шкафу или&nbsp;нравятся</p>
      </div>
      <div className={cx(shared.field, s.field)}>
        <Icon name="search" size={20} />
        Найти бренд
      </div>
      <ul className={s.list}>
        {BRANDS.map((b) => (
          <li key={b} className={s.row}>
            {b}
            <span className={cx(s.heart, LIKED.has(b) && s.liked)}>
              <Icon name="heart" filled={LIKED.has(b)} size={22} />
            </span>
          </li>
        ))}
      </ul>
      <div className={s.fade} />
      <p className={cx(shared.cta, shared.ctaMuted)}>Ещё 1 бренд</p>
    </KroyScreen>
  )
}
