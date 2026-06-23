import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { getQuestions, startAttempt, runSubmission, submitSubmission } from '../lib/api'

type LanguageConfig = {
  name: string
  extension: string
  apiName: string
  template: string
}

const LANGUAGES: Record<number, LanguageConfig> = {
  54: {
    name: 'C++ (GNU 14)',
    extension: 'cpp',
    apiName: 'cpp',
    template: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    if (!(cin >> n)) return 0;
    cout << n;
    return 0;
}`,
  },
  71: {
    name: 'Python 3.11',
    extension: 'python',
    apiName: 'python',
    template: `n = int(input())
print(n)`,
  },
  62: {
    name: 'Java (OpenJDK 13)',
    extension: 'java',
    apiName: 'java',
    template: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(n);
    }
}`,
  },
  63: {
    name: 'JavaScript (Node.js)',
    extension: 'javascript',
    apiName: 'javascript',
    template: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('', (n) => {
    console.log(n);
    rl.close();
});`,
  },
}

const LANGUAGE_IDS = Object.keys(LANGUAGES).map(Number)

interface QuestionItem {
  id: number
  title: string
  description: string
  difficulty: string
  input_format?: string
  output_format?: string
  sample_input?: string
  sample_output?: string
}

export default function ExamRoom() {
  const { examId } = useParams<{ examId: string }>()
  const assessmentId = Number(examId)
  const [selectedLanguage, setSelectedLanguage] = useState<number>(54)
  const [code, setCode] = useState<string>(LANGUAGES[54].template)
  const [testInput, setTestInput] = useState<string>('7')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [lastResult, setLastResult] = useState<string>('')
  const [runDebug, setRunDebug] = useState<string>('')
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState<string>('')

  useEffect(() => {
    if (!assessmentId || Number.isNaN(assessmentId)) {
      setPageError('Invalid assessment selected.')
      setLoading(false)
      return
    }

    const loadExam = async () => {
      setLoading(true)
      setPageError('')
      try {
        const questionsResponse = await getQuestions(assessmentId)
        const fetchedQuestions = questionsResponse.data
        setQuestions(fetchedQuestions)
        if (fetchedQuestions.length > 0) {
          setSelectedQuestionId(fetchedQuestions[0].id)
        }

        const attemptResponse = await startAttempt({ assessment_id: assessmentId })
        setAttemptId(attemptResponse.data.id)
      } catch (err: any) {
        setPageError(err.response?.data?.detail || err.message || 'Unable to load the exam.')
      } finally {
        setLoading(false)
      }
    }

    loadExam()
  }, [assessmentId])

  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === selectedQuestionId),
    [questions, selectedQuestionId],
  )

  const handleLanguageChange = (langId: number) => {
    setSelectedLanguage(langId)
    setCode(LANGUAGES[langId].template)
    setOutput('')
    setError('')
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('')
    setError('')
    try {
      const response = await runSubmission({
        source_code: code,
        language: LANGUAGES[selectedLanguage].apiName,
        stdin: testInput,
      })
      setOutput(response.data.stdout || '')
      setRunDebug(JSON.stringify(response.data.debug || response.data, null, 2))

      const compileError = response.data.compile_output || response.data.stderr
      if (compileError) {
        setError(compileError)
      }

      if (response.data.error) {
        setError((prev) => prev ? `${prev}\n${response.data.error}` : response.data.error)
      }

      if (response.data.success) {
        setLastResult('Accepted')
      } else if (response.data.status) {
        setLastResult(`Result: ${response.data.status}`)
      } else {
        setLastResult('Ran successfully')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error running code')
      setLastResult('Error')
    } finally {
      setIsRunning(false)
    }
  }

  const submitCode = async () => {
    if (!attemptId || !selectedQuestionId) {
      setError('No active attempt or question selected.')
      return
    }

    setIsRunning(true)
    setError('')
    try {
      const response = await submitSubmission({
        attempt_id: attemptId,
        question_id: selectedQuestionId,
        code,
        language: LANGUAGES[selectedLanguage].apiName,
      })
      setLastResult(`Submitted! Score: ${response.data.score}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error submitting code')
      setLastResult('Submission failed')
    } finally {
      setIsRunning(false)
    }
  }

  const editorLanguageMap: Record<number, string> = {
    54: 'cpp',
    71: 'python',
    62: 'java',
    63: 'javascript',
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Live coding</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Backend hiring exam</h2>
          </div>
          <div className="rounded-3xl bg-slate-900 px-5 py-4 text-sm text-slate-300">
            <p>Time Remaining</p>
            <p className="mt-1 text-2xl font-semibold text-white">{selectedQuestion ? 'Live exam' : 'Loading...'}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 text-center text-slate-300">Loading exam...</div>
      ) : pageError ? (
        <div className="rounded-[36px] border border-red-600 bg-red-950/80 p-8 text-center text-red-300">{pageError}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 shadow-soft">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-cyan-300">Problem</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{selectedQuestion?.title || 'Loading question...'}</h3>
                </div>
                <div className="rounded-3xl bg-slate-950 px-4 py-2 text-sm text-slate-300">
                  <p className="font-semibold text-white">Attempt</p>
                  <p className="mt-1 text-sm">{attemptId ? `#${attemptId}` : 'pending'}</p>
                </div>
              </div>
              <p className="mt-4 text-slate-300">{selectedQuestion?.description || 'Select a question to begin coding.'}</p>
              {selectedQuestion?.sample_input && (
                <div className="mt-6 rounded-3xl bg-slate-900 p-4 text-sm text-slate-400">
                  <p className="font-semibold text-white">Sample input</p>
                  <pre className="mt-3 whitespace-pre-wrap">{selectedQuestion.sample_input}</pre>
                  {selectedQuestion.sample_output && (
                    <>
                      <p className="mt-4 font-semibold text-white">Expected output</p>
                      <pre className="mt-3 whitespace-pre-wrap">{selectedQuestion.sample_output}</pre>
                    </>
                  )}
                </div>
              )}

              <div className="mt-6">
                <p className="text-sm text-cyan-300">Test Input</p>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={4}
                  placeholder="Enter test input here..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-6 shadow-soft">
            <div className="flex flex-col gap-3 rounded-3xl bg-slate-900 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Code editor</p>
                <div className="mt-2 flex items-center gap-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(Number(e.target.value))}
                    className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {LANGUAGE_IDS.map((langId) => (
                      <option key={langId} value={langId}>
                        {LANGUAGES[langId as keyof typeof LANGUAGES].name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:opacity-50"
                  type="button"
                >
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={submitCode}
                  disabled={isRunning || !attemptId || !selectedQuestionId}
                  className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
                  type="button"
                >
                  {isRunning ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>

            <div className="mt-5 h-[420px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
              <Editor
                height="100%"
                language={editorLanguageMap[selectedLanguage] || 'cpp'}
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value || '')}
                options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Execution</p>
                <p className="mt-2 text-sm font-semibold text-white">{isRunning ? 'Working...' : 'Ready'}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Last Result</p>
                <p className={`mt-2 text-sm font-semibold ${lastResult.includes('Error') || lastResult.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
                  {lastResult || 'N/A'}
                </p>
              </div>
            </div>

            {output && (
              <div className="mt-4 rounded-3xl bg-slate-900 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Output</p>
                <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{output}</pre>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-3xl bg-red-950 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-red-400">Error</p>
                <pre className="mt-3 whitespace-pre-wrap text-sm text-red-300">{error}</pre>
              </div>
            )}

            {runDebug && (
              <div className="mt-4 rounded-3xl bg-slate-900 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Debug</p>
                <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{runDebug}</pre>
              </div>
            )}

            {questions.length > 0 && (
              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Questions</p>
                <div className="mt-3 grid gap-3">
                  {questions.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setSelectedQuestionId(question.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left ${selectedQuestionId === question.id ? 'border-cyan-500 bg-slate-800' : 'border-slate-800 bg-slate-950 hover:border-slate-600'}`}
                    >
                      <p className="font-semibold text-white">{question.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{question.difficulty}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
