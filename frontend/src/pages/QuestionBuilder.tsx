export default function QuestionBuilder() {
  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Question builder</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Create rich coding challenges.</h2>
          </div>
          <p className="max-w-xl text-slate-400">Add titles, descriptions and multiple test cases. Hidden cases keep the assessment strong.</p>
        </div>
      </div>
      <form className="grid gap-6 rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Question title
            <input className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" placeholder="Implement prime checker" />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Difficulty
            <select className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
        </div>
        <label className="space-y-2 text-sm text-slate-300">
          Problem description
          <textarea rows={6} className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-white focus:border-cyan-500 focus:outline-none" placeholder="Write a C++ function that validates whether a number is prime." />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((testcase) => (
            <div key={testcase} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm font-semibold text-white">Test case {testcase}</p>
              <label className="mt-4 block text-sm text-slate-400">Input</label>
              <textarea rows={2} className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-white" />
              <label className="mt-4 block text-sm text-slate-400">Expected output</label>
              <textarea rows={2} className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-white" />
              <label className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500" />
                Hidden case
              </label>
            </div>
          ))}
        </div>
        <button className="w-full rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
          Save question
        </button>
      </form>
    </div>
  )
}
