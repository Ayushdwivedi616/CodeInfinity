import { FormEvent, useState } from 'react'
import { createAssessment } from '../lib/api'

export default function ExamBuilder() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('60')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')
    setError('')

    const minutes = Number(duration)
    if (!title.trim() || Number.isNaN(minutes) || minutes <= 0) {
      setError('Please provide a valid title and duration.')
      return
    }

    setSaving(true)
    try {
      await createAssessment({
        title: title.trim(),
        description: description.trim(),
        duration_minutes: minutes,
      })
      setStatus('Assessment created successfully.')
      setTitle('')
      setDescription('')
      setDuration('60')
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to create assessment')
    } finally {
      setSaving(false)
    }
  }

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
      <form onSubmit={handleSubmit} className="grid gap-6 rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Exam title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="Backend developer assessment"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Duration
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="60 minutes"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-slate-300">
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Select the best candidates with a focused coding exam."
          />
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
        {status && <div className="rounded-3xl bg-emerald-950 p-4 text-emerald-300">{status}</div>}
        {error && <div className="rounded-3xl bg-red-950 p-4 text-red-300">{error}</div>}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Publish exam'}
        </button>
      </form>
    </div>
  )
}
