interface ExamCardProps {
  title: string
  description: string
  questions: number
  href: string
}

export default function ExamCard({ title, description, questions, href }: ExamCardProps) {
  return (
    <a href={href} className="group block rounded-3xl border border-slate-800 bg-slate-950/85 p-6 transition hover:border-cyan-500 hover:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Assessment</p>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{questions} questions</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-slate-400">{description}</p>
    </a>
  )
}
