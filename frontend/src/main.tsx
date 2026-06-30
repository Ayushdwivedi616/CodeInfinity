import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'
import { initializeAuth } from './lib/api'

// Restore auth token into axios headers on page load
initializeAuth()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

// signal that the app loaded successfully (used by index.html fallback)
window.__app_loaded = true
console.log('Code Infinity app mounted')
