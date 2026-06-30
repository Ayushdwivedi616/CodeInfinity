import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getAuthToken, getUserRoleFromToken, api } from '../lib/api'

interface Props {
  children: JSX.Element
  requiredRole?: 'admin' | 'candidate'
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const token = getAuthToken()

  useEffect(() => {
    if (!token) {
      setAuthorized(false)
      setChecking(false)
      return
    }
    // verify token with backend /me
    api
      .get('/me')
      .then((res) => {
        const role = getUserRoleFromToken(token)
        if (requiredRole) {
          setAuthorized(!!role && role.toLowerCase() === requiredRole)
        } else {
          setAuthorized(true)
        }
      })
      .catch(() => setAuthorized(false))
      .finally(() => setChecking(false))
  }, [token, requiredRole])

  if (checking)
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <div>Checking authentication…</div>
      </div>
    )
  if (!authorized) return <Navigate to="/login" replace />
  return children
}
