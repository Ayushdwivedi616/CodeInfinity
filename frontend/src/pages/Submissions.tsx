export default function Submissions() {
  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Submission review</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Track candidate performance.</h2>
          </div>
          <p className="max-w-xl text-slate-400">Monitor run statuses, scores, and result details across every completed assessment.</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-[36px] border border-slate-800 bg-slate-950/85 shadow-soft">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
          <thead className="bg-slate-900/70 text-slate-400">
            <tr>
              <th className="px-6 py-4">Candidate</th>
              <th className="px-6 py-4">Exam</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/60">
            {Array.from({ length: 4 }).map((_, index) => (
              <tr key={index} className="hover:bg-slate-900/80 transition">
                <td className="px-6 py-5">candidate{index + 1}@example.com</td>
                <td className="px-6 py-5">Backend developer assessment</td>
                <td className="px-6 py-5 font-semibold text-white">{80 + index}%</td>
                <td className="px-6 py-5 text-cyan-200">Completed</td>
                <td className="px-6 py-5">2 hours ago</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
