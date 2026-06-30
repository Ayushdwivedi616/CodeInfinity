import React from 'react'

type State = { hasError: boolean; error?: Error | null }

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: any) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40 }}>
          <h1>Application error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: 'red' }}>{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
