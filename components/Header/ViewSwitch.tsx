'use client'

import { t, type Locale } from '@/lib/i18n'
import { VIEWS } from '@/lib/view'
import { chooseView, useViewState } from '@/lib/viewStore'

export function ViewSwitch({ lang }: { lang: Locale }) {
  const { view } = useViewState()
  return (
    <>
      <span className="pill pill--ghost">{t(lang, 'projectsView')}</span>
      {VIEWS.map((v) => (
        <button key={v} type="button" className="pill" aria-pressed={view === v} onClick={() => chooseView(v)}>
          {t(lang, v)}
        </button>
      ))}
    </>
  )
}
