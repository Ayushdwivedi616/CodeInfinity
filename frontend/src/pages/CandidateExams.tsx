import { Link } from 'react-router-dom'
import ExamCard from '../components/ExamCard'

const exams = [
  { title: 'Backend hiring exam', description: 'A 60-minute assessment for backend engineers.', questions: 3, href: '/candidate/room/1' },
  { title: 'Front-end code challenge', description: 'Modern UI and algorithm questions for frontend talent.', questions: 2, href: '/candidate/room/2' },
]

export default function CandidateExams() {
  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Candidate dashboard</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Choose an exam and start coding.</h2>
          </div>
          <p className="max-w-xl text-slate-400">View your active assessments, launch the coding environment, and submit your work in C++.</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {exams.map((exam) => (
          <ExamCard key={exam.title} {...exam} />
        ))}
      </div>
      <div className="rounded-[36px] border border-slate-800 bg-slate-950/85 p-8 shadow-soft">
        <p className="text-slate-300">Need help? Reach out to your recruiter for instructions and submission windows.</p>
      </div>
    </div>
  )
}
