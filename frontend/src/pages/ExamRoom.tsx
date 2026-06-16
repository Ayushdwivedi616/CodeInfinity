import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { api } from '../lib/api'

const LANGUAGES = {
  54: { name: 'C++ (GNU 14)', extension: 'cpp', template: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    if (!(cin >> n)) return 0;
    cout << n;
    return 0;
}` },
  71: { name: 'Python 3.11', extension: 'python', template: `n = int(input())
print(n)` },
  62: { name: 'Java (OpenJDK 13)', extension: 'java', template: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(n);
    }
}` },
  63: { name: 'JavaScript (Node.js)', extension: 'javascript', template: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('', (n) => {
    console.log(n);
    rl.close();
});` }
}

const LANGUAGE_IDS = Object.keys(LANGUAGES).map(Number)

export default function ExamRoom() {
  const [selectedLanguage, setSelectedLanguage] = useState<number>(54)
  const [code, setCode] = useState<string>(LANGUAGES[54].template)
  const [testInput, setTestInput] = useState<string>('7')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [lastResult, setLastResult] = useState<string>('')

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
      const response = await api.post('/submit/run', {
        source_code: code,
        language_id: selectedLanguage,
        stdin: testInput
      })
      
      setOutput(response.data.stdout || '')
      if (response.data.stderr) {
        setError(response.data.stderr)
      }
      if (response.data.compile_output) {
        setError(response.data.compile_output)
      }
      setLastResult('Ran successfully')
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error running code')
      setLastResult('Error')
    } finally {
      setIsRunning(false)
    }
  }

  const submitCode = async () => {
    setIsRunning(true)
    try {
      const response = await api.post('/submit/', {
        exam_id: 1, // TODO: Get from URL params
        question_id: 1, // TODO: Get from URL params
        source_code: code,
        language_id: selectedLanguage
      })
      
      setLastResult(`Submitted! Score: ${response.data.score}/${response.data.total}`)
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
    63: 'javascript'
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
            <p className="mt-1 text-2xl font-semibold text-white">52:15</p>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 shadow-soft">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-cyan-300">Problem</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Prime validator</h3>
            <p className="mt-4 text-slate-300">
              Implement a function that reads an integer from standard input and prints whether the number is prime. Process a single integer and return <span className="font-semibold text-white">YES</span> or <span className="font-semibold text-white">NO</span>.
            </p>
            <div className="mt-6 rounded-3xl bg-slate-900 p-4 text-sm text-slate-400">
              <p className="font-semibold text-white">Sample input</p>
              <pre className="mt-3 whitespace-pre-wrap">7</pre>
              <p className="mt-4 font-semibold text-white">Expected output</p>
              <pre className="mt-3 whitespace-pre-wrap">YES</pre>
            </div>
            
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
              >
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={submitCode}
                disabled={isRunning}
                className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
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
              <p className="mt-2 text-sm font-semibold text-white">{isRunning ? 'Running...' : 'Ready'}</p>
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
        </div>
      </div>
    </div>
  )
}
