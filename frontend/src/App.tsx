import { useEffect, useState } from 'react'
import { Route, Routes, NavLink, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/AdminDashboard'
import QuestionBuilder from './pages/QuestionBuilder'
import ExamBuilder from './pages/ExamBuilder'
import Submissions from './pages/Submissions'
import CandidateExams from './pages/CandidateExams'
import ExamRoom from './pages/ExamRoom'
import History from './pages/History'
import Login from './pages/Login'
import { initializeAuth, isAuthenticated } from './lib/api'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated())

  useEffect(() => {
    initializeAuth()

    const handleAuthChange = () => {
      setAuthenticated(isAuthenticated())
    }

    window.addEventListener('authChange', handleAuthChange)
    return () => window.removeEventListener('authChange', handleAuthChange)
  }, [])

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return authenticated ? <>{children}</> : <Navigate to="/login" replace />
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <span className="text-xl font-semibold text-white">Code Infinity</span>
            </div>
            <nav className="flex items-center gap-6">
              <NavLink to="/" className={navLinkClass}>
                Login
              </NavLink>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-10">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <span className="text-xl font-semibold text-white">Code Infinity</span>
          </div>
          <nav className="flex items-center gap-6">
            <NavLink to="/home" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
            <NavLink to="/candidate" className={navLinkClass}>
              Candidate
            </NavLink>
            <NavLink to="/" className={navLinkClass}>
              Login
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/questions" element={<ProtectedRoute><QuestionBuilder /></ProtectedRoute>} />
          <Route path="/admin/exams" element={<ProtectedRoute><ExamBuilder /></ProtectedRoute>} />
          <Route path="/admin/submissions" element={<ProtectedRoute><Submissions /></ProtectedRoute>} />
          <Route path="/candidate" element={<ProtectedRoute><CandidateExams /></ProtectedRoute>} />
          <Route path="/candidate/room/:examId" element={<ProtectedRoute><ExamRoom /></ProtectedRoute>} />
          <Route path="/candidate/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
