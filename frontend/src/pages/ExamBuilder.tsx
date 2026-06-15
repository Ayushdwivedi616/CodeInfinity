export default function ExamBuilder() {
  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Exam designer</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Build assessments in minutes.</h2>
          </div>
          <p className="max-w-xl text-slate-400">Group questions into exams and prepare a polished candidate test experience.</p>
        </div>
      </div>
      <form className="grid gap-6 rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Exam title
            <input className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" placeholder="Backend developer assessment" />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Duration
            <input className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" placeholder="60 minutes" />
          </label>
        </div>
        <label className="space-y-2 text-sm text-slate-300">
          Description
          <textarea rows={4} className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-white focus:border-cyan-500 focus:outline-none" placeholder="Select the best candidates with a focused coding exam." />
        </label>
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
          <p className="text-sm font-semibold text-white">Select questions</p>
          <div className="mt-5 grid gap-4">
            {["Prime checker", "Array rotation", "Path finder"].map((item) => (
              <label key={item} className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500" />
                <span className="text-slate-300">{item}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="w-full rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
          Publish exam
        </button>
      </form>
    </div>
  )
}
