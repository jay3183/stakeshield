'use client'

import { useVerificationHistory } from '@/hooks/use-verification-history'
import { formatDistanceToNow } from 'date-fns'

export function VerificationHistory() {
  const { verifications, isLoading } = useVerificationHistory()

  if (isLoading) {
    return <div>Loading verification history...</div>
  }

  return (
    <div className="space-y-4">
      {verifications.map((verification) => (
        <div
          key={verification.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${verification.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">
                Proof {verification.proofId.slice(0, 6)}...{verification.proofId.slice(-4)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Operator: {verification.operator.slice(0, 6)}...{verification.operator.slice(-4)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {verification.isValid ? 'Valid' : 'Invalid'}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(verification.timestamp * 1000, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}

      {verifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No verifications yet
        </div>
      )}
    </div>
  )
} 