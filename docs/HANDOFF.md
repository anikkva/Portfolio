# ANIKKVA Portfolio — контекст для продолжения работы

Документ для нового чата: что за проект, что уже сделано, как устроено, о чём договорились и что осталось. Обновлено: 2026-10-10 (вечер).

## Кто и что

- Владелец: **ANIKKVA** — продуктовый дизайнер. Общение на русском.
- Сайт-портфолио в духе combine.pics (моно-типографика, «таблетки», раскиданные карточки, Random/Grid/List, текст-манифест), но со своей идеей **«чернила»** и своим шрифтом.
- Репозиторий: `~/code/Portfolio` → GitHub `anikkva/Portfolio` (ветка `main`).
- Живой сайт: **https://portfolio-gold-five-83.vercel.app** (Vercel деплоит `main` автоматически).
- Локально: `npm run dev` → http://localhost:3000/ru (главная), `/ru/playground` (Play).

## Договорённости о работе (важно)

- **Не делать `git push` без явной просьбы.** Коммитить локально; пользователь пушит пачкой («пушим»). Сейчас **24 локальных коммита ждут отправки** (вместе с этим исправлением) (проверить: `git log --oneline origin/main..main`).
- Перед push нужен вход: из связки ключей macOS пропал вход GitHub. Пользователь должен выполнить `gh auth login` (gh уже установлен через brew; выбрать HTTPS → Yes authenticate Git → браузер).
- Анимации — **сдержанно**: одно движение на экран, остальное статично. Пользователь часто просит убрать лишнее — предлагать минимальные варианты, показывать 2–3 опции на выбор.
- Процесс по каждому экрану Play: прислать экран → предложить варианты микроанимации → пользователь выбирает/правит → собрать → проверить → локальный коммит.
- Перед действиями со шрифтами/иконками проверять лицензию (см. ниже).

## Стек и структура

- Next.js 16.3 (App Router, Turbopack, статическая генерация), React 19.3, TypeScript 5, CSS Modules, `motion` (motion/react), `lenis`, `zod` 4, `gray-matter`, `@mdx-js/mdx` + `rehype-slug`, `vitest` (27 тестов).
- **Next 16 отличается от старых версий** — сверяться с `node_modules/next/dist/docs/` (см. AGENTS.md). View transitions работают без флага (`experimental.viewTransition` больше не существует).
- Языки `ru` (по умолчанию) / `en`, URL `/ru/...`, `/en/...`; `/` → `/ru` (redirect в next.config.ts).

```
app/[lang]/            layout (шрифт, Header, Footer, SmoothScroll, InkCursor), page (главная),
                       work/[slug], about, cv, playground, not-found
app/globals.css        токены, .pill, .ui, .page, .prose; скрытие курсора (html.ink-cursor) + возврат курсора в <dialog>
components/            Header, Footer, Hero, Projects (Random/Grid/List), Manifesto, Case, mdx, Media,
                       Playground, ink (InkText, InkReveal, InkCursor, SmoothScroll)
components/play/       PlayScreen (рамка-телефон 393×852, масштаб, hover/touch → active), IosChrome (статус-бар),
                       DotNumber, fonts.ts (Geist, Geist Mono, DM Mono, Unbounded, JetBrains Mono — OFL),
                       screens/{weather,train,wb,dating}/
lib/                   i18n, view/viewStore (вид проектов в URL), scatter, toc, mdx, content/* (zod-загрузчики),
                       playScreens.ts (список имён экранов), useMotionAllowed, useMediaQuery
content/               site.json, projects/<slug>/index.{ru,en}.mdx, about/cv .{ru,en}.mdx, playground/*.json
public/                fonts/ (AnikkvaInk, lebowski, rt-obligat), work/, play/pragmatica/{ios,weather,train,wb,dating}/
font-lab/              Python-пайплайн шрифта Anikkva Ink (fontTools + shapely), свой venv
docs/superpowers/      спецификация и планы (specs/2026-09-26-portfolio-design.md, plans/*)
scripts/make-placeholders.mjs   генератор заглушек (не перезаписывает файлы)
```

Проверки: `npx tsc --noEmit`, `npx vitest run`, `npm run build`.

## Что сделано

1. **Шрифт Anikkva Ink** — производный от JetBrains Mono (OFL) с «чернильными затёками» (closing/opening через shapely), Regular+Bold, `public/fonts/`, OFL.txt. Пересборка: `cd font-lab && .venv/bin/python build_final.py --base jetbrains --strength medium`.
2. **Сайт** по плану `docs/superpowers/plans/2026-09-26-website.md`: главная (герой из чернил, Random/Grid/List с layout-анимациями Motion, манифест), кейсы (MDX-блоки, оглавление, «следующий проект», переход обложки через React `<ViewTransition>`), About, CV, Playground, RU/EN, чернильный курсор (быстрая пружина 2000/40/0.2), Lenis, reduced-motion, noscript. Lighthouse ≥ 91/96.
3. **Деплой на Vercel**, плагин Vercel для Claude установлен и авторизован.
4. **Playground: 8 экранов практики Pragmatica**, пересобранных в коде из Figma, сверху страницы (сетка 4 в ряд, каждый второй опущен на 72px; на планшете 2, на мобильном 1). Заглушки (01–09.json) ниже masonry.

| Экран (content/playground) | Компонент | При наведении |
|---|---|---|
| s1 Погода · список | WeatherList | статичный (голубой) |
| s2 Погода · шкала | WeatherDial | дуга прокручивает часы 08:00→13:00 (−7…−2°); большая цифра и фон статичны |
| s3 WB · промо | WbPromo | блик по кнопке «Активировать и поехать» |
| s4 WB · пригласи друга | WbInvite | «прогресс бахчи»: заливка строк, Тимур 0→60%, у Ани выпрыгивает галочка |
| s5 ЖД · поиск | TrainSearch | Moscow ↔ Saint Petersburg меняются местами, ⇆ поворачивается |
| s6 ЖД · выбор места | TrainSeat | статичный (82/23 точками через DotNumber) |
| s7 ЖД · билет | TrainTicket | марка откидывается вверх (rotateX 180 + сдвиг), снизу проявляются детали |
| s8 Дейтинг | DatingProfile | дудлы перерисовываются линией (stroke-dashoffset) |

Отказались (по просьбе пользователя): анимация погоды-списка, фон/цифра на шкале, анимация 82 на выборе места, копирование кода с тостом, скролл и покачивание папок в дейтинге.

## Как добавлять экран Play

1. Figma-файл: `QsINEvSyHjEMiUQexrCZPG` (Pragmatica), секция `1:40`. Фреймы: погода `1:43`, `1:315`, `1:377`, `1:644`; ЖД `1:1359`, `1:1426`, `1:1587`, `1:1738`; WB `1:2318` (промо), `1:1893` (инвайт); дейтинг `1:2347`.
2. Через Figma MCP: `get_design_context` (перед этим загрузить скилл figma-design-to-code), ассеты — `curl` по выданным URL в `public/play/pragmatica/<task>/`.
3. SF Symbols выгружать `download_assets` с `defaultFormat: svg`, затем вырезать сам глиф из экспорта (экспорт тянет фоны слайда).
4. Компонент `components/play/screens/<task>/<Name>.tsx` + `.module.css` (абсолютные координаты Figma 393×852), принимает `{ active }`.
5. Зарегистрировать: `lib/playScreens.ts` (имя) и `components/play/PlayScreen.tsx` (SCREENS), JSON в `content/playground/` (`{ "screen": "...", "caption": {ru,en}, "year": 2026 }`; порядок — по имени файла, экраны с префиксом `sN-`).
6. Проверять в **Playwright** (видимая вкладка). Панель браузера приложения при скрытии ставит анимации на паузу — не доверять ей для анимаций. Курсор-клик в эмулированном 1440 в панели промахивается — кликать через JS.

## Шрифты и лицензии

- Lebowski by Pragmatica — бесплатный, встраивание ок, файл не изменять (`public/fonts/lebowski/`, README).
- RT Obligat FREE (Riesling Type) — fsType 8 (встраивание разрешено), оригинал в `public/fonts/rt-obligat/`.
- Arial Narrow, SF Pro — **не встраивать** (заголовки дейтинга выгружены SVG; SF Pro берётся системно).
- SF Symbols — пользователь решил оставить (мокапы iOS); 5by7 нет — цифры точками через DotNumber.
- Google Fonts через next/font (OFL). Archivo Narrow без кириллицы — не подходит.


## Сессия 2026-10-10: Play и кейс «Крой»

- Play: заглушки удалены, остались 8 экранов Pragmatica; файлы переименованы `s01…s08`; верх ровной линией, hover — scale 1.04; отступ под заголовком больше.
- Кейс Sber (ВКС/Jazz) пробовали и **удалили** по просьбе пользователя — не возвращать без запроса.
- **«Крой»** — собственный пет-проект (концепт гардероба-стилиста), идея по мотивам Alta, но свои название, лого, вёрстка, русский язык. Стиль: ч/б, **прямые углы внутри UI**, Inter + курсив Playfair Display для акцентов, логотип Oswald. Пользователь смотрел «мягкий» стиль по референсам (скругления, таблетки) — **отказался, остаёмся в старом**.
- Кейс: `content/projects/kroy/` — **скрыт флагом `draft: true`** (решение пользователя: не собирать кейс и не добавлять экраны в Play, пока все сценарии не готовы в Figma). На главной снова заглушка «Маркетплейс». Чтобы вернуть: убрать `draft`, удалить `market-checkout`, обложка `public/work/kroy/cover.jpg`. В кейсе пока только онбординг: MDX-блок `<Screens names={[...]}/>` рендерит экраны из кода.
- Экраны в коде: `components/play/screens/kroy/` (Welcome, Work, Wear, Brands) зарегистрированы в `lib/playScreens.ts`, но **в Play не показываются** (пользователь попросил убрать).
- **Figma** (файл Pragmatica `QsINEvSyHjEMiUQexrCZPG`): страница «Крой» `19:138` — **11 секций** сценариев сверху вниз (1 Онбординг … 7 Календарь, 8 Лента, 9 Профиль, 10 Вход, 11 Виджеты) по дереву сценариев Alta (переведено). **все 112 экранов нарисованы** (рамок «Экран в работе» не осталось). Подпись строки — TEXT 36px над экраном (y = экран.y − 70). Клавиатуры в 5.8.1, 6.3, 6.7.2 — серые заглушки «клавиатура», можно заменить на настоящие. Таб-бар: Главная, Гардероб, +, Лента, Профиль (календарь — с главной), скругление секций 128, фреймов 48, без вложенных секций, подписи подсценариев текстом. Референсы Alta — страница «ALTA мода» `14:416` (не публиковать).
- **UI kit** «Крой — UI kit» (страница `51:138` в том же файле): переменные (коллекции «Крой / Primitives», «Крой / Color», «Крой / Dimensions»), 12 текстовых стилей «Крой/…», 30 иконок `Icon/*`, компоненты Button (Primary/Secondary × L/M/S), Chip, Field, Checkbox, Toggle, Status bar, Home indicator, Tab bar (4 active), Sheet header, Toast, Dialog, List row (Value/Checkbox/Toggle), Item tile, iOS Keyboard / RU (Буквы/Цифры). **Экраны пока НЕ переведены на компоненты** (кроме клавиатуры) — следующий шаг по запросу.
- **Мини-брендинг** — страница «Крой — брендинг» (`58:2`): компонент «Крой / Знак» (К в детали выкройки: пунктир припуска + 4 надсечки, светлая/тёмная тема) и 7 слайдов 1920×1080: обложка, идея («Крой — это *выкройка* вашего стиля»), знак и логотип, цвет и шрифты (Чернила/Мел/Подклад/Нитка), паттерн «Выкройка», мозаика носителей (иконка, постер с моделью, бирка, тканая этикетка, шопер, гардероб), соцсети. Структура по мотивам кейса ALTA (HuskyFox) на Behance, графика своя.
- Ассеты: `public/play/kroy/*.png` — 12 вещей без фона (сгенерированы в Magnific, кредиты закончились) и `model.png` (Unsplash, Olha Ivanova; фон снят macOS Vision скриптом). Источники — `public/play/kroy/CREDITS.md`. Папка `refs/` в .gitignore.
- Дальше: перенести экраны 5–10 (главная, добавление, распознавание, гардероб, образ, календарь) в код и в кейс; заменить обложку на телефоны; уточнить у пользователя проблему/задачу кейса (сейчас сформулированы мной); возможно убрать логотип Nike на кедах модели.

## Открытые вопросы / дальше

- **Push 19 коммитов** после `gh auth login` (затем Vercel сам задеплоит; проверить через плагин Vercel).
- **Коннектор GitHub для Claude** не работает: нужен `GITHUB_PERSONAL_ACCESS_TOKEN`. Предложено: после `gh auth login` добавить в `~/.zshrc` строку `export GITHUB_PERSONAL_ACCESS_TOKEN="$(gh auth token 2>/dev/null)"` (спросить разрешения) — или отключить плагин.
- **Фото в дейтинге** похоже на реальную известную актрису — для публичного сайта рекомендовано заменить (пользователь пока не решил).
- Заглушки: проекты, About, CV, манифест, email `hello@anikkva.com`, соцсети, 9 заглушек в Playground — заменить реальным контентом.
- Возможное: свой домен, админка Keystatic (структура контента уже совместима), год практики Pragmatica (сейчас 2026 — уточнить).
