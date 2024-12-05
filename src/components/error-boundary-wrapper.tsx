'use client'

import { ErrorBoundary } from './error-boundary'
import { toast } from 'react-hot-toast'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error) => void
}

export function ErrorBoundaryWrapper({ 
  children, 
  fallback,
  onError 
}: Props) {
  const handleError = (error: Error) => {
    console.error('Error caught by boundary:', error)
    toast.error('Something went wrong')
    onError?.(error)
  }

  return (
    <ErrorBoundary 
      fallback={fallback || <DefaultErrorFallback />}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  )
}

function DefaultErrorFallback() {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h2 className="text-red-800">Something went wrong</h2>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        Try again
      </button>
    </div>
  )
} 