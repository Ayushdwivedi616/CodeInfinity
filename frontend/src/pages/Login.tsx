import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setAuthToken } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login({ username: email, password })
      const token = response.data.access_token
      localStorage.setItem('auth_token', token)
      setAuthToken(token)
      navigate('/admin')
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[40px] border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-white">Sign in</h1>
      <p className="mt-3 text-slate-400">Use your admin or candidate credentials to access the platform.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <label className="block text-sm text-slate-300">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </label>
        {error && <div className="rounded-3xl bg-red-950 p-4 text-red-300">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
