'use client'

import { useEffect, useRef, useState } from 'react'
import { Media } from '@/components/Media/Media'
import { PlayScreen } from '@/components/play/PlayScreen'
import type { PlayScreenName } from '@/lib/playScreens'
import s from './Playground.module.css'

type Item = { id: string; media?: string; screen?: PlayScreenName; caption: string; year: number }

export function Playground({ items: input, closeLabel }: { items: Item[]; closeLabel: string }) {
  // Coded screens lead the page; the viewer's ←/→ follows the same order.
  const items = [...input.filter((item) => item.screen), ...input.filter((item) => !item.screen)]
  const screenCount = items.filter((item) => item.screen).length
  const [index, setIndex] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (index !== null && !d.open) d.showModal()
    if (index === null && d.open) d.close()
  }, [index])

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i === null ? i : (i + 1) % items.length))
      if (e.key === 'ArrowLeft') setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, items.length])

  const current = index === null ? null : items[index]

  const renderItem = (item: Item, i: number) => (
    <button
      key={item.id}
      type="button"
      className={item.screen ? `${s.item} ${s.screenItem}` : s.item}
      onClick={() => setIndex(i)}
      data-cursor="card"
      data-cursor-label="OPEN"
    >
      {item.screen ? (
        <div className={s.phone}>
          <PlayScreen name={item.screen} />
        </div>
      ) :<Media src={item.media!} alt={item.caption} className={s.media} />}
      <span className={`ui ${s.caption}`}>
        <span>{item.caption}</span>
        <span>{item.year}</span>
      </span>
    </button>
  )

  return (
    <>
      <div className={s.screens}>{items.slice(0, screenCount).map((item, i) => renderItem(item, i))}</div>
      <div className={s.masonry}>{items.slice(screenCount).map((item, i) => renderItem(item, screenCount + i))}</div>
      <dialog ref={dialog} className={s.dialog} onClose={() => setIndex(null)} aria-label={current?.caption}>
        {current && index !== null && (
          <div className={s.dialogInner}>
            {current.screen ? (
              <div className={s.dialogScreen}>
                <PlayScreen name={current.screen} />
              </div>
            ) : (
              <Media src={current.media!} alt={current.caption} className={s.dialogMedia} eager />
            )}
            <div className={`ui ${s.dialogBar}`}>
              <span>
                {current.caption} · {current.year}
              </span>
              <span>
                {index + 1} / {items.length}
              </span>
            </div>
          </div>
        )}
        <button type="button" className={`pill ${s.close}`} onClick={() => setIndex(null)}>
          {closeLabel}
        </button>
      </dialog>
    </>
  )
}
