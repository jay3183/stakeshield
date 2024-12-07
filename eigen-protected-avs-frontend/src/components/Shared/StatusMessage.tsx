'use client'

import { cn } from "@/lib/utils"

interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  className?: string
}

export function StatusMessage({ type, message, className }: StatusMessageProps) {
  return (
    <div
      className={cn(
        "rounded-md p-4 text-sm",
        {
          'bg-green-50 text-green-700 border border-green-200': type === 'success',
          'bg-red-50 text-red-700 border border-red-200': type === 'error',
          'bg-yellow-50 text-yellow-700 border border-yellow-200': type === 'warning',
          'bg-blue-50 text-blue-700 border border-blue-200': type === 'info',
        },
        className
      )}
    >
      {message}
    </div>
  )
} 