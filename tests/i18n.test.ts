import { describe, expect, it } from 'vitest'
import { asLocale, isLocale, switchLocalePath, t } from '@/lib/i18n'

describe('i18n', () => {
  it('recognises locales', () => {
    expect(isLocale('ru')).toBe(true)
    expect(isLocale('de')).toBe(false)
    expect(asLocale('de')).toBe('ru')
  })

  it('switches the locale segment', () => {
    expect(switchLocalePath('/ru/work/alpha', 'en')).toBe('/en/work/alpha')
    expect(switchLocalePath('/ru', 'en')).toBe('/en')
    expect(switchLocalePath('/', 'en')).toBe('/en')
    expect(switchLocalePath('/en/about/', 'ru')).toBe('/ru/about')
  })

  it('translates UI strings', () => {
    expect(t('en', 'getInTouch')).toBe('GET IN TOUCH')
    expect(t('ru', 'getInTouch')).toBe('НАПИСАТЬ')
  })
})
