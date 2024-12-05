'use client'

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 h-6 w-6 ${className}`} />
  )
}