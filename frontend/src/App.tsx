import { Route, Routes, NavLink } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/AdminDashboard'
import QuestionBuilder from './pages/QuestionBuilder'
import ExamBuilder from './pages/ExamBuilder'
import Submissions from './pages/Submissions'
import CandidateExams from './pages/CandidateExams'
import ExamRoom from './pages/ExamRoom'
import History from './pages/History'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <span className="text-xl font-semibold text-white">Code Infinity</span>
          </div>
          <nav className="flex items-center gap-6">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
            <NavLink to="/candidate" className={navLinkClass}>
              Candidate
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<QuestionBuilder />} />
          <Route path="/admin/exams" element={<ExamBuilder />} />
          <Route path="/admin/submissions" element={<Submissions />} />
          <Route path="/candidate" element={<CandidateExams />} />
          <Route path="/candidate/room/:examId" element={<ExamRoom />} />
          <Route path="/candidate/history" element={<History />} />
        </Routes>
      </main>
    </div>
  )
}
