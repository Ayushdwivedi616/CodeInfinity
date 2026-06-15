import { Link } from 'react-router-dom'

const panels = [
  { title: 'Create questions', description: 'Build challenges with hidden and public test cases.', href: '/admin/questions' },
  { title: 'Create exams', description: 'Package questions into hiring-ready exam flows.', href: '/admin/exams' },
  { title: 'View submissions', description: 'Inspect candidate results and score distributions.', href: '/admin/submissions' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Admin workspace</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Design exams with enterprise-level control.</h2>
          </div>
          <p className="max-w-xl text-slate-400">Use the admin dashboard to author technical questions, configure assessment pipelines, and review incoming candidate submissions.</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {panels.map((panel) => (
          <Link
            key={panel.title}
            to={panel.href}
            className="rounded-3xl border border-slate-800 bg-slate-950/85 p-8 transition hover:border-cyan-500 hover:bg-slate-900"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{panel.title}</p>
            <h3 className="mt-5 text-2xl font-semibold text-white">{panel.title}</h3>
            <p className="mt-3 text-slate-400">{panel.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
