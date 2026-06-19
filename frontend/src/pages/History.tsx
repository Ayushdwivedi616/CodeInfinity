import { useEffect, useState } from 'react'
import { getSubmissionHistory } from '../lib/api'

interface SubmissionRecord {
  id: number
  attempt_id: number
  question_id: number
  score: number
  language: string
  submitted_at: string
}

export default function History() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getSubmissionHistory()
        setSubmissions(response.data)
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [])

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
      {loading ? (
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 text-center text-slate-300">Loading history...</div>
      ) : error ? (
        <div className="rounded-[36px] border border-red-600 bg-red-950/80 p-8 text-center text-red-300">{error}</div>
      ) : submissions.length === 0 ? (
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 text-center text-slate-300">No submissions have been recorded yet.</div>
      ) : (
        <div className="grid gap-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="rounded-[32px] border border-slate-800 bg-slate-950/85 p-6 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Submission</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Question #{submission.question_id}</h3>
                </div>
                <div className="rounded-3xl bg-slate-900 px-4 py-2 text-sm text-slate-300">Completed</div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
                  <p className="text-sm">Score</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{submission.score}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
                  <p className="text-sm">Attempt</p>
                  <p className="mt-2 text-white">#{submission.attempt_id}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
                  <p className="text-sm">Submitted</p>
                  <p className="mt-2 text-white">{new Date(submission.submitted_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
