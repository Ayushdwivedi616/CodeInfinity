import { useState } from 'react'
import Editor from '@monaco-editor/react'

export default function ExamRoom() {
  const [code, setCode] = useState<string>(`#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    if (!(cin >> n)) return 0;
    cout << n;
    return 0;
}`)
  const [isRunning, setIsRunning] = useState(false)

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
          </div>
        </div>
        <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-900 px-5 py-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Code editor</p>
              <p className="mt-1 text-slate-400">C++ / GNU14</p>
            </div>
            <button className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              Submit
            </button>
          </div>
          <div className="mt-5 h-[520px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            <Editor
              height="100%"
              defaultLanguage="cpp"
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
            />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Execution</p>
              <p className="mt-2 text-xl font-semibold text-white">{isRunning ? 'Running...' : 'Ready'}</p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-4 text-slate-300">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Last test</p>
              <p className="mt-2 text-xl font-semibold text-white">84% pass</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
