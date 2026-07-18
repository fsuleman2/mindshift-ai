import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { StorageService } from '@/services/storageService'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('MindShift AI crashed:', error, info.componentStack)
  }

  private handleReset = () => {
    this.setState({ error: null })
  }

  private handleResetData = () => {
    StorageService.resetAll()
    this.setState({ error: null })
    window.location.href = window.location.pathname
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-2xl font-heading">Something went wrong</h1>
        <p className="max-w-md text-muted-foreground">
          MindShift AI hit an unexpected error. You can try again, or reset your local data if the problem
          persists — your progress is only stored on this device.
        </p>
        <div className="flex gap-3">
          <Button onClick={this.handleReset}>Try again</Button>
          <Button variant="outline" onClick={this.handleResetData}>
            Reset app data
          </Button>
        </div>
      </div>
    )
  }
}
