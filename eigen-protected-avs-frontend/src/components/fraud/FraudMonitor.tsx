'use client'

import { useFraudMonitoring, type FraudEvent } from '@/hooks/use-fraud-monitoring'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatDistanceToNow } from 'date-fns'

export function FraudMonitor() {
  const { fraudEvents, isLoading } = useFraudMonitoring()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!fraudEvents.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No fraud events detected
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {fraudEvents.map((event: FraudEvent) => (
        <div
          key={`${event.proofId}-${event.timestamp}`}
          className={`p-4 rounded-lg border ${
            event.isValid 
              ? 'bg-red-50 border-red-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {event.isValid ? 'Fraud Detected' : 'Fraud Proof Rejected'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {event.details}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(event.timestamp * 1000, { addSuffix: true })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 