import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ExamCard from '../components/ExamCard'
import { getAssessments } from '../lib/api'

interface Assessment {
  id: number
  title: string
  description?: string
  duration_minutes: number
}

export default function CandidateExams() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getAssessments()
        setAssessments(response.data)
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to load assessments')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Candidate dashboard</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Choose an exam and start coding.</h2>
          </div>
          <p className="max-w-xl text-slate-400">View your active assessments, launch the coding environment, and submit your work.</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 text-center text-slate-300">Loading assessments...</div>
      ) : error ? (
        <div className="rounded-[36px] border border-red-600 bg-red-950/80 p-8 text-center text-red-300">{error}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {assessments.map((assessment) => (
            <ExamCard
              key={assessment.id}
              title={assessment.title}
              description={assessment.description || 'No description provided.'}
              questions={0}
              href={`/candidate/room/${assessment.id}`}
            />
          ))}
        </div>
      )}

      <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 shadow-soft">
        <p className="text-slate-300">Need help? Reach out to your recruiter for instructions and submission windows.</p>
      </div>
    </div>
  )
}
