'use client'

import { Card } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { useFraudProofs } from '@/hooks/use-fraud-proofs'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function FraudProofHistory() {
  const { proofs, isLoading } = useFraudProofs()

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Fraud Proof History</h3>
      <div className="space-y-4">
        {proofs.map((proof) => (
          <div key={proof.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">
                  Operator: {proof.operator.address}
                </p>
                <p className="text-sm text-gray-500">
                  Proof: {proof.proofId.slice(0, 10)}...
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    proof.isValid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {proof.isValid ? 'Valid' : 'Invalid'}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(proof.timestamp), {
                    addSuffix: true
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {proofs.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No fraud proofs submitted yet
          </div>
        )}
      </div>
    </Card>
  )
} 