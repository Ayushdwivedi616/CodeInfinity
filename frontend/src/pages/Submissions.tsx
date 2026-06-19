import { useEffect, useState } from 'react'
import { getAllSubmissions } from '../lib/api'

interface SubmissionRow {
  id: number
  attempt_id: number
  question_id: number
  score: number
  language: string
  submitted_at: string
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSubmissions = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getAllSubmissions()
        setSubmissions(response.data)
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to load submissions')
      } finally {
        setLoading(false)
      }
    }
    loadSubmissions()
  }, [])

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

      {loading ? (
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 text-center text-slate-300">Loading submissions...</div>
      ) : error ? (
        <div className="rounded-[36px] border border-red-600 bg-red-950/80 p-8 text-center text-red-300">{error}</div>
      ) : submissions.length === 0 ? (
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 text-center text-slate-300">No submissions found.</div>
      ) : (
        <div className="overflow-hidden rounded-[36px] border border-slate-800 bg-slate-950/85 shadow-soft">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
            <thead className="bg-slate-900/70 text-slate-400">
              <tr>
                <th className="px-6 py-4">Submission</th>
                <th className="px-6 py-4">Attempt</th>
                <th className="px-6 py-4">Question</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/60">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-slate-900/80 transition">
                  <td className="px-6 py-5">#{submission.id}</td>
                  <td className="px-6 py-5">#{submission.attempt_id}</td>
                  <td className="px-6 py-5">{submission.question_id}</td>
                  <td className="px-6 py-5 font-semibold text-white">{submission.score}</td>
                  <td className="px-6 py-5">{new Date(submission.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
