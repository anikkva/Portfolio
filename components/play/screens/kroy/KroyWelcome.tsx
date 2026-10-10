import type { ScreenProps } from '@/components/play/PlayScreen'
import { cx } from '@/lib/cx'
import shared from './Kroy.module.css'
import s from './KroyWelcome.module.css'
import { KroyScreen } from './parts'

const FEATURES = ['Гардероб', 'Образ дня', 'По погоде']

/** Крой · welcome. */
export function KroyWelcome({ active }: ScreenProps) {
  return (
    <KroyScreen className={cx(active && s.active)}>
      <p className={s.wordmark}>КРОЙ</p>
      <div className={s.rule} />
      <p className={s.tagline}>
        Гардероб, который <em>собирает</em> образ за&nbsp;вас
      </p>
      <ol className={s.features}>
        {FEATURES.map((f, i) => (
          <li key={f}>
            <span>0{i + 1}</span>
            {f}
          </li>
        ))}
      </ol>
      <p className={cx(shared.cta, s.cta)}>Начать</p>
      <p className={s.login}>У меня уже есть аккаунт</p>
    </KroyScreen>
  )
}
