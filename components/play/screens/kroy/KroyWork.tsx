import type { ScreenProps } from '@/components/play/PlayScreen'
import { cx } from '@/lib/cx'
import shared from './Kroy.module.css'
import s from './KroyWork.module.css'
import { Icon, KroyScreen, Steps } from './parts'

const JOBS = ['Дизайнер', 'Юрист', 'Маркетолог', 'Разработчик', 'Студентка', 'Учитель', 'Врач', 'Менеджер', 'Предприниматель', 'Фрилансер']

/** Крой · onboarding, “what do you do”. */
export function KroyWork({ active }: ScreenProps) {
  return (
    <KroyScreen className={cx(active && s.active)}>
      <Steps step={1} total={4} />
      <div className={shared.head}>
        <p className={shared.title}>
          Чем вы <em>занимаетесь</em>?
        </p>
        <p className={shared.lead}>Подберём образы и&nbsp;для будней, и&nbsp;для выходных</p>
      </div>
      <div className={cx(shared.field, s.field)}>
        <Icon name="search" size={20} />
        Профессия или род занятий
      </div>
      <div className={s.chips}>
        {JOBS.map((job, i) => (
          <span key={job} className={cx(s.chip, i === 0 && s.on)}>
            {job}
          </span>
        ))}
      </div>
      <p className={shared.cta}>Продолжить</p>
    </KroyScreen>
  )
}
