export const LOCALES = ['ru', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'ru'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function asLocale(value: string): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export function switchLocalePath(pathname: string, to: Locale): string {
  const rest = pathname.split('/').filter(Boolean)
  if (rest.length > 0 && isLocale(rest[0])) rest.shift()
  return '/' + [to, ...rest].join('/')
}

const ru = {
  projectsView: 'Вид проектов',
  random: '♺ Случайно',
  grid: '∷ Сетка',
  list: '☰ Список',
  about: 'Обо мне',
  cv: 'CV',
  play: 'Play',
  getInTouch: 'НАПИСАТЬ',
  work: '← Работы',
  menu: 'Меню',
  close: 'Закрыть',
  readAboutMe: 'Подробнее обо мне ↗',
  backToTop: '↑ Наверх',
  contact: 'Почта',
  follow: 'Соцсети',
  nextProject: 'Следующий проект →',
  contents: 'Содержание',
  downloadPdf: 'Скачать PDF ↓',
  experience: 'Опыт',
  education: 'Образование',
  skills: 'Навыки',
  clients: 'Клиенты и компании',
  notFound: 'Страница не найдена',
  home: 'На главную',
}

export type UiKey = keyof typeof ru

const en: Record<UiKey, string> = {
  projectsView: 'Projects view',
  random: '♺ Random',
  grid: '∷ Grid',
  list: '☰ List',
  about: 'About',
  cv: 'CV',
  play: 'Play',
  getInTouch: 'GET IN TOUCH',
  work: '← Work',
  menu: 'Menu',
  close: 'Close',
  readAboutMe: 'Read about me ↗',
  backToTop: '↑ Back to top',
  contact: 'Email',
  follow: 'Follow',
  nextProject: 'Next project →',
  contents: 'Contents',
  downloadPdf: 'Download PDF ↓',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  clients: 'Clients & companies',
  notFound: 'Page not found',
  home: 'Home',
}

const UI: Record<Locale, Record<UiKey, string>> = { ru, en }

export function t(lang: Locale, key: UiKey): string {
  return UI[lang][key]
}
