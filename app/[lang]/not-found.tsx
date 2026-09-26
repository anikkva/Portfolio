import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="page">
      <h1 className="page-title">404</h1>
      <p className="ui">Страница не найдена · Page not found</p>
      <p style={{ marginTop: 24 }}>
        <Link href="/ru" className="pill">
          ← ANIKKVA
        </Link>
      </p>
    </section>
  )
}
