import { useEffect, useState } from 'react'
import { createQuestion, getAssessments } from '../lib/api'

interface Assessment {
  id: number
  title: string
}

interface TestCaseForm {
  input_data: string
  expected_output: string
  is_hidden: boolean
  weight: number
}

export default function QuestionBuilder() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [description, setDescription] = useState('')
  const [inputFormat, setInputFormat] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [constraints, setConstraints] = useState('')
  const [sampleInput, setSampleInput] = useState('')
  const [sampleOutput, setSampleOutput] = useState('')
  const [testCases, setTestCases] = useState<TestCaseForm[]>([
    { input_data: '', expected_output: '', is_hidden: false, weight: 1 },
    { input_data: '', expected_output: '', is_hidden: true, weight: 1 },
  ])
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getAssessments()
        setAssessments(response.data)
        if (response.data.length > 0) {
          setSelectedAssessment(response.data[0].id)
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to load assessments')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleTestCaseChange = (index: number, field: keyof TestCaseForm, value: string | boolean) => {
    setTestCases((current) =>
      current.map((testCase, idx) =>
        idx === index ? { ...testCase, [field]: value } : testCase,
      ),
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedAssessment) {
      setError('Please select an assessment')
      return
    }
    setSaving(true)
    setStatus('')
    setError('')

    try {
      await createQuestion({
        assessment_id: selectedAssessment,
        title,
        description,
        difficulty,
        input_format: inputFormat,
        output_format: outputFormat,
        constraints,
        sample_input: sampleInput,
        sample_output: sampleOutput,
        test_cases: testCases,
      })
      setStatus('Question saved successfully')
      setTitle('')
      setDescription('')
      setInputFormat('')
      setOutputFormat('')
      setConstraints('')
      setSampleInput('')
      setSampleOutput('')
      setTestCases([
        { input_data: '', expected_output: '', is_hidden: false, weight: 1 },
        { input_data: '', expected_output: '', is_hidden: true, weight: 1 },
      ])
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save question')
    } finally {
      setSaving(false)
    }
  }

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

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Assessment
            <select
              value={selectedAssessment ?? ''}
              onChange={(e) => setSelectedAssessment(Number(e.target.value))}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
            >
              {assessments.map((assessment) => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.title}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm text-slate-300">
          Question title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Implement prime checker"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          Problem description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Write a C++ function that validates whether a number is prime."
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Input format
            <input
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. single integer"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Output format
            <input
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. YES or NO"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm text-slate-300">
          Constraints
          <input
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
            placeholder="e.g. 1 <= n <= 10^6"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Sample input
            <textarea
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              rows={3}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Sample output
            <textarea
              value={sampleOutput}
              onChange={(e) => setSampleOutput(e.target.value)}
              rows={3}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
          <p className="text-sm font-semibold text-white">Test cases</p>
          <div className="mt-5 grid gap-4">
            {testCases.map((testCase, index) => (
              <div key={index} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Test case {index + 1}</p>
                  <label className="flex items-center gap-2 text-sm text-slate-400">
                    <input
                      type="checkbox"
                      checked={testCase.is_hidden}
                      onChange={(e) => handleTestCaseChange(index, 'is_hidden', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
                    />
                    Hidden
                  </label>
                </div>
                <label className="mt-4 block text-sm text-slate-400">Input</label>
                <textarea
                  rows={2}
                  value={testCase.input_data}
                  onChange={(e) => handleTestCaseChange(index, 'input_data', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-white"
                />
                <label className="mt-4 block text-sm text-slate-400">Expected output</label>
                <textarea
                  rows={2}
                  value={testCase.expected_output}
                  onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-white"
                />
              </div>
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
          {saving ? 'Saving...' : 'Save question'}
        </button>
      </form>
    </div>
  )
}
