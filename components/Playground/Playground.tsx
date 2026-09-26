'use client'

import { useEffect, useRef, useState } from 'react'
import { Media } from '@/components/Media/Media'
import s from './Playground.module.css'

type Item = { id: string; media: string; caption: string; year: number }

export function Playground({ items, closeLabel }: { items: Item[]; closeLabel: string }) {
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

  return (
    <>
      <div className={s.masonry}>
        {items.map((item, i) => (
          <button key={item.id} type="button" className={s.item} onClick={() => setIndex(i)} data-cursor="card" data-cursor-label="OPEN">
            <Media src={item.media} alt={item.caption} className={s.media} />
            <span className={`ui ${s.caption}`}>
              <span>{item.caption}</span>
              <span>{item.year}</span>
            </span>
          </button>
        ))}
      </div>
      <dialog ref={dialog} className={s.dialog} onClose={() => setIndex(null)} aria-label={current?.caption}>
        {current && index !== null && (
          <div className={s.dialogInner}>
            <Media src={current.media} alt={current.caption} className={s.dialogMedia} eager />
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
