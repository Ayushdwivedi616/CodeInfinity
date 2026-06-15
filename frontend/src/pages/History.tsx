export default function History() {
  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Submission history</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Review your recent activity.</h2>
          </div>
          <p className="max-w-xl text-slate-400">Your completed attempts are shown below with status and score for each exam.</p>
        </div>
      </div>
      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-[32px] border border-slate-800 bg-slate-950/85 p-6 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Submission</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Backend hiring exam</h3>
              </div>
              <div className="rounded-3xl bg-slate-900 px-4 py-2 text-sm text-slate-300">Completed</div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
                <p className="text-sm">Score</p>
                <p className="mt-2 text-2xl font-semibold text-white">{90 - index * 10}%</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
                <p className="text-sm">Question</p>
                <p className="mt-2 text-white">Prime validator</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
                <p className="text-sm">Submitted</p>
                <p className="mt-2 text-white">{index + 1} day ago</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
