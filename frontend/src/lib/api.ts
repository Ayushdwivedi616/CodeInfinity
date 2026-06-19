import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export function initializeAuth() {
  const token = localStorage.getItem('auth_token')
  if (token) {
    setAuthToken(token)
  }
  return token
}

export function logout() {
  localStorage.removeItem('auth_token')
  setAuthToken(null)
}

export async function login(payload: { username: string; password: string }) {
  const data = new URLSearchParams()
  data.append('username', payload.username)
  data.append('password', payload.password)

  return api.post('/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export async function getAssessments() {
  return api.get('/assessments')
}

export async function getAssessment(assessmentId: number) {
  return api.get(`/assessments/${assessmentId}`)
}

export async function createAssessment(payload: { title: string; description?: string; duration_minutes: number; question_ids?: number[] }) {
  return api.post('/assessments', payload)
}

export async function getQuestions(assessmentId?: number) {
  return api.get('/questions', { params: { assessment_id: assessmentId } })
}

export async function createQuestion(payload: {
  assessment_id: number
  title: string
  description: string
  difficulty: string
  input_format?: string
  output_format?: string
  constraints?: string
  sample_input?: string
  sample_output?: string
  test_cases: Array<{ input_data: string; expected_output: string; is_hidden: boolean; weight: number }>
}) {
  return api.post('/questions', payload)
}

export async function startAttempt(payload: { assessment_id: number }) {
  return api.post('/attempts', payload)
}

export async function runSubmission(payload: { source_code: string; language: string; stdin: string }) {
  return api.post('/submissions/run', payload)
}

export async function submitSubmission(payload: { attempt_id: number; question_id: number; code: string; language: string }) {
  return api.post('/submissions', payload)
}

export async function getSubmissionHistory() {
  return api.get('/submissions/history')
}

export async function getAllSubmissions() {
  return api.get('/submissions/all')
}
