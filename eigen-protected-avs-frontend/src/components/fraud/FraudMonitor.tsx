'use client'

import { useFraudMonitoring } from '@/hooks/use-fraud-monitoring'
import { LoadingSpinner } from '../ui/loading-spinner'
import { formatDistanceToNow } from 'date-fns'
import { Card } from '../ui/card'

export function FraudMonitor() {
  const { fraudEvents, isLoading } = useFraudMonitoring()

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Fraud Monitoring</h2>
        <div className="text-sm text-gray-500">
          {fraudEvents.length} events detected
        </div>
      </div>

      <div className="grid gap-4">
        {fraudEvents.map((event) => (
          <Card key={event.proofId} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Operator: {event.operator}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Proof ID: {event.proofId}
                </p>
                <p className="text-sm mt-2">{event.details}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.verified ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.verified ? 'Verified' : 'Pending'}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(event.timestamp * 1000, { addSuffix: true })}
                </p>
              </div>
            </div>
          </Card>
        ))}

        {fraudEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No fraud events detected
          </div>
        )}
      </div>
    </div>
  )
} 