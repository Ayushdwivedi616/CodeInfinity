import { Link } from 'react-router-dom'

interface AuthCardProps {
  title: string
  description: string
  cta: string
  href: string
  accent: string
}

export default function AuthCard({ title, description, cta, href, accent }: AuthCardProps) {
  return (
    <div className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
      <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${accent}`}>
        {title}
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-white">{title} access</h3>
      <p className="mt-3 text-slate-400">{description}</p>
      <Link
        to={href}
        className="mt-8 inline-flex items-center justify-center rounded-2xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
      >
        {cta}
      </Link>
    </div>
  )
}
