#!/usr/bin/env node
// Writes placeholder content and media for the portfolio. Never overwrites existing files,
// so it is safe to run again after replacing placeholders with real work.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function writeOnce(rel, content) {
  const file = path.join(ROOT, rel)
  if (fs.existsSync(file)) return
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
  console.log('+', rel)
}

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PALETTES = [
  ['#E9ECFF', '#2B3BFF', '#9AA5FF', '#141726'],
  ['#FFF1EC', '#FF3B1F', '#FFB199', '#141726'],
  ['#EEF7EF', '#1F9D55', '#9ED9B0', '#141726'],
  ['#F4EEFF', '#7A3BFF', '#C8B2FF', '#141726'],
  ['#F2F2F2', '#141726', '#8A8FA3', '#FFFFFF'],
  ['#FFF8E1', '#FFB300', '#FFE08A', '#141726'],
]

function blobSvg(seed, w, h, label = '') {
  const rand = mulberry32(seed)
  const pal = PALETTES[Math.floor(rand() * PALETTES.length)]
  const blobs = Array.from({ length: 5 }, (_, i) => {
    const r = Math.min(w, h) * (0.15 + rand() * 0.3)
    return `<circle cx="${(rand() * w).toFixed(0)}" cy="${(rand() * h).toFixed(0)}" r="${r.toFixed(0)}" fill="${pal[1 + (i % 3)]}" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`
  }).join('')
  const text = label
    ? `<text x="24" y="${h - 28}" font-family="monospace" font-size="${Math.round(h / 22)}" fill="${pal[3]}" opacity=".6">${label}</text>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.round(Math.min(w, h) / 10)}"/></filter></defs><rect width="100%" height="100%" fill="${pal[0]}"/><g filter="url(#b)">${blobs}</g>${text}</svg>\n`
}

function minimalPdf(text) {
  const stream = `BT /F1 24 Tf 72 760 Td (${text}) Tj ET`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
  ]
  let out = '%PDF-1.4\n'
  const offsets = objects.map((body, i) => {
    const offset = out.length
    out += `${i + 1} 0 obj\n${body}\nendobj\n`
    return offset
  })
  const xref = out.length
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  out += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return out
}

const frontmatter = (obj) =>
  '---\n' +
  Object.entries(obj)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n') +
  '\n---\n'

const COVER_SIZE = { S: [800, 1000], M: [1200, 900], L: [1600, 1000] }

const PROJECTS = [
  { slug: 'market-checkout', type: 'case', size: 'L', year: 2025, order: 1,
    title: { ru: 'Маркетплейс. Корзина и оплата', en: 'Marketplace. Checkout redesign' },
    role: { ru: 'Lead Product Designer', en: 'Lead Product Designer' },
    team: { ru: '6 человек', en: '6 people' }, duration: { ru: '4 месяца', en: '4 months' },
    tags: ['mobile', 'e-commerce'],
    task: { ru: 'Пользователи бросали корзину на шаге оплаты: путь занимал пять экранов, а стоимость доставки появлялась только в самом конце.', en: 'People abandoned the cart at payment: checkout took five screens and the delivery cost showed up only at the very end.' } },
  { slug: 'bank-onboarding', type: 'case', size: 'M', year: 2024, order: 2,
    title: { ru: 'Банк. Онбординг за 3 минуты', en: 'Bank. 3-minute onboarding' },
    role: { ru: 'Senior Product Designer', en: 'Senior Product Designer' },
    team: { ru: '8 человек', en: '8 people' }, duration: { ru: '6 месяцев', en: '6 months' },
    tags: ['fintech', 'mobile'],
    task: { ru: 'Открытие счёта занимало 15 минут и требовало визита в офис. Нужно было уложиться в 3 минуты и не потерять в безопасности.', en: 'Opening an account took 15 minutes and a branch visit. The goal was 3 minutes without compromising security.' } },
  { slug: 'b2b-analytics', type: 'case', size: 'M', year: 2024, order: 3,
    title: { ru: 'B2B-аналитика. Дашборды', en: 'B2B analytics. Dashboards' },
    role: { ru: 'Product Designer', en: 'Product Designer' },
    duration: { ru: '5 месяцев', en: '5 months' },
    tags: ['b2b', 'web', 'data'],
    task: { ru: 'Менеджеры собирали отчёты вручную в таблицах. Нужны были дашборды, которые отвечают на вопрос за 10 секунд.', en: 'Managers built reports by hand in spreadsheets. They needed dashboards that answer a question in 10 seconds.' } },
  { slug: 'health-booking', type: 'case', size: 'S', year: 2023, order: 4,
    title: { ru: 'Сервис здоровья. Запись к врачу', en: 'Health app. Doctor booking' },
    role: { ru: 'Product Designer', en: 'Product Designer' },
    duration: { ru: '3 месяца', en: '3 months' },
    tags: ['healthcare', 'mobile'],
    task: { ru: 'Запись к врачу через колл-центр занимала в среднем 7 минут ожидания. Нужно было перенести её в приложение.', en: 'Booking a doctor via the call centre meant a 7-minute wait on average. The task was to move it into the app.' } },
  { slug: 'ink-ui', type: 'case', size: 'L', year: 2023, order: 5,
    title: { ru: 'Дизайн-система Ink UI', en: 'Ink UI design system' },
    role: { ru: 'Design System Lead', en: 'Design System Lead' },
    team: { ru: '4 человека', en: '4 people' }, duration: { ru: '8 месяцев', en: '8 months' },
    tags: ['design system'],
    task: { ru: 'Пять продуктовых команд рисовали одни и те же компоненты по-разному. Нужна была общая система в Figma и в коде.', en: 'Five product teams drew the same components differently. They needed one shared system in Figma and in code.' } },
  { slug: 'travel-concept', type: 'gallery', size: 'M', year: 2022, order: 6,
    title: { ru: 'Путешествия. Концепт', en: 'Travel. Concept' },
    role: { ru: 'Visual Designer', en: 'Visual Designer' },
    tags: ['concept', 'visual'] },
  { slug: 'food-shots', type: 'gallery', size: 'S', year: 2022, order: 7,
    title: { ru: 'Доставка еды. UI-шоты', en: 'Food delivery. UI shots' },
    role: { ru: 'UI Designer', en: 'UI Designer' },
    tags: ['ui', 'mobile'] },
  { slug: 'behance-archive', type: 'link', size: 'S', year: 2021, order: 8,
    title: { ru: 'Архив на Behance', en: 'Archive on Behance' },
    role: { ru: 'Разные роли', en: 'Various roles' },
    tags: ['archive'], externalUrl: 'https://www.behance.net/' },
]

const T = {
  ru: {
    task: 'Задача', research: 'Исследование', solution: 'Решение', result: 'Результат',
    researchText: 'Провели 12 глубинных интервью, разобрали аналитику воронки и карту пути пользователя. Главный инсайт: люди теряются не из-за количества шагов, а из-за неясности, что будет дальше.',
    solutionText: 'Собрали три гипотезы, проверили их на кликабельных прототипах и выбрали ту, что сократила путь и сняла тревогу. Дальше — итерации вместе с разработкой и A/B-тест.',
    quote: 'Наконец-то понятно, что происходит после нажатия кнопки.', quoteAuthor: 'Участник юзабилити-теста',
    stats: [['+12%', 'конверсия'], ['−40%', 'время на задачу'], ['4.8', 'оценка в сторах']],
    galleryText: 'Визуальное исследование: настроение, цвет, типографика и ключевые экраны.',
  },
  en: {
    task: 'Task', research: 'Research', solution: 'Solution', result: 'Result',
    researchText: 'We ran 12 in-depth interviews and went through funnel analytics and the customer journey map. Key insight: people get lost not because of the number of steps, but because they cannot tell what happens next.',
    solutionText: 'We shaped three hypotheses, tested them on clickable prototypes and picked the one that shortened the path and removed anxiety. Then came iterations with engineering and an A/B test.',
    quote: 'Finally I understand what happens after I press the button.', quoteAuthor: 'Usability test participant',
    stats: [['+12%', 'conversion'], ['−40%', 'time on task'], ['4.8', 'store rating']],
    galleryText: 'A visual exploration: mood, colour, typography and key screens.',
  },
}

const media = (slug, n) => `/work/${slug}/${String(n).padStart(2, '0')}.svg`

function caseBody(lang, p) {
  const t = T[lang]
  const stats = JSON.stringify(t.stats.map(([value, label]) => ({ value, label })))
  return `
## ${t.task}

${p.task[lang]}

<Media src="${media(p.slug, 1)}" alt="" full />

## ${t.research}

${t.researchText}

<MediaGrid cols={2}>
  <Media src="${media(p.slug, 2)}" alt="" />
  <Media src="${media(p.slug, 3)}" alt="" />
</MediaGrid>

<Quote author="${t.quoteAuthor}">${t.quote}</Quote>

## ${t.solution}

${t.solutionText}

<BeforeAfter before="${media(p.slug, 4)}" after="${media(p.slug, 5)}" />

## ${t.result}

<Stats items={${stats}} />
`
}

function galleryBody(lang, p) {
  return `
${T[lang].galleryText}

<Media src="${media(p.slug, 1)}" alt="" full />

<Media src="${media(p.slug, 2)}" alt="" full />

<Media src="${media(p.slug, 3)}" alt="" full />
`
}

let seed = 1
for (const p of PROJECTS) {
  const [w, h] = COVER_SIZE[p.size]
  writeOnce(`public/work/${p.slug}/cover.svg`, blobSvg(seed++, w, h, p.slug))
  if (p.type === 'case') {
    const sizes = [[1600, 1000], [800, 1000], [800, 1000], [1600, 1000], [1600, 1000]]
    sizes.forEach(([mw, mh], i) => writeOnce(media(p.slug, i + 1).replace(/^\//, 'public/'), blobSvg(seed++, mw, mh)))
  }
  if (p.type === 'gallery') {
    for (let i = 1; i <= 3; i++) writeOnce(media(p.slug, i).replace(/^\//, 'public/'), blobSvg(seed++, 1600, 1000))
  }
  for (const lang of ['ru', 'en']) {
    const meta = frontmatter({
      title: p.title[lang], type: p.type, externalUrl: p.externalUrl, year: p.year, role: p.role[lang],
      team: p.team?.[lang], duration: p.duration?.[lang], tags: p.tags, cover: `/work/${p.slug}/cover.svg`,
      size: p.size, order: p.order, featured: true,
    })
    const body = p.type === 'case' ? caseBody(lang, p) : p.type === 'gallery' ? galleryBody(lang, p) : ''
    writeOnce(`content/projects/${p.slug}/index.${lang}.mdx`, meta + body)
  }
}

writeOnce('public/manifesto/01.svg', blobSvg(101, 400, 300))
writeOnce('public/manifesto/02.svg', blobSvg(102, 400, 300))
writeOnce('content/site.json', JSON.stringify({
  name: 'ANIKKVA',
  role: { ru: 'Продуктовый дизайнер', en: 'Product designer' },
  email: 'hello@anikkva.com',
  socials: [
    { label: 'Telegram', url: 'https://t.me/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { label: 'Behance', url: 'https://www.behance.net/' },
  ],
  manifesto: {
    ru: ['Я проектирую', { sym: '∴' }, 'продукты, которые', { img: '/manifesto/01.svg' }, 'понятны людям', { sym: '⊗' }, 'и полезны бизнесу. Исследую, упрощаю', { img: '/manifesto/02.svg' }, 'и довожу до релиза', { sym: '⇦' }],
    en: ['I design', { sym: '∴' }, 'products that', { img: '/manifesto/01.svg' }, 'feel obvious to people', { sym: '⊗' }, 'and work for business. I research, simplify', { img: '/manifesto/02.svg' }, 'and ship', { sym: '⇦' }],
  },
}, null, 2) + '\n')

writeOnce('public/about/photo.svg', blobSvg(201, 900, 1200, 'photo'))
const ABOUT = {
  ru: { title: 'Обо мне', body: 'Я продуктовый дизайнер. Восемь лет проектирую мобильные и веб-продукты: от исследования и гипотез до релиза и замеров.\n\nЛюблю сложные системы, которые снаружи выглядят просто, и команды, где дизайн, продукт и разработка говорят на одном языке.' },
  en: { title: 'About', body: 'I am a product designer. For eight years I have been designing mobile and web products, from research and hypotheses to release and measurement.\n\nI love complex systems that look simple from the outside, and teams where design, product and engineering speak the same language.' },
}
for (const lang of ['ru', 'en']) {
  writeOnce(`content/about.${lang}.mdx`, frontmatter({
    title: ABOUT[lang].title, photo: '/about/photo.svg',
    skills: ['Product discovery', 'UX research', 'Prototyping', 'Design systems', 'Figma', 'Motion'],
    clients: ['Marketplace', 'Bank', 'Health service', 'B2B SaaS'],
  }) + '\n' + ABOUT[lang].body + '\n')
}

writeOnce('public/cv/anikkva-cv.pdf', minimalPdf('ANIKKVA - CV (placeholder)'))
const CV = {
  ru: { title: 'Резюме', body: 'Продуктовый дизайнер с опытом в e-commerce, финтехе и B2B. Веду задачи от исследования до релиза.',
    experience: [
      { years: '2023 — сейчас', company: 'Маркетплейс', role: 'Lead Product Designer' },
      { years: '2021 — 2023', company: 'Банк', role: 'Senior Product Designer' },
      { years: '2018 — 2021', company: 'Digital-агентство', role: 'Product Designer' },
    ],
    education: [{ years: '2014 — 2018', place: 'Университет', degree: 'Дизайн' }] },
  en: { title: 'CV', body: 'Product designer with experience in e-commerce, fintech and B2B. I lead work from research to release.',
    experience: [
      { years: '2023 — now', company: 'Marketplace', role: 'Lead Product Designer' },
      { years: '2021 — 2023', company: 'Bank', role: 'Senior Product Designer' },
      { years: '2018 — 2021', company: 'Digital agency', role: 'Product Designer' },
    ],
    education: [{ years: '2014 — 2018', place: 'University', degree: 'Design' }] },
}
for (const lang of ['ru', 'en']) {
  const { title, body, experience, education } = CV[lang]
  writeOnce(`content/cv.${lang}.mdx`, frontmatter({ title, pdf: '/cv/anikkva-cv.pdf', experience, education }) + '\n' + body + '\n')
}

const PLAY = [
  ['Чернильный курсор', 'Ink cursor', 800, 1000], ['Микро-анимация лайка', 'Like micro-animation', 800, 800],
  ['Онбординг-иллюстрации', 'Onboarding illustrations', 1200, 900], ['Генеративные обложки', 'Generative covers', 800, 1100],
  ['Типографический плакат', 'Type poster', 900, 1200], ['Виджеты iOS', 'iOS widgets', 1200, 800],
  ['Иконки 24px', '24px icons', 800, 800], ['Лендинг-эксперимент', 'Landing experiment', 1200, 1000],
  ['3D-кнопка', '3D button', 800, 1000],
]
PLAY.forEach(([ru, en, w, h], i) => {
  const id = String(i + 1).padStart(2, '0')
  writeOnce(`public/playground/${id}.svg`, blobSvg(300 + i, w, h))
  writeOnce(`content/playground/${id}.json`, JSON.stringify({ media: `/playground/${id}.svg`, caption: { ru, en }, year: 2025 - (i % 3) }, null, 2) + '\n')
})
