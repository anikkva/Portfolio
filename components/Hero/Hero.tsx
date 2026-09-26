import s from './Hero.module.css'

export function Hero({ name }: { name: string }) {
  return (
    <section className={s.hero}>
      <div className={s.plate}>
        <h1 className={s.title}>{name.toLowerCase()}</h1>
      </div>
    </section>
  )
}
