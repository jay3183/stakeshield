'use client'

import { Card } from '@/components/ui/card'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { formatEther } from 'viem'

export function DashboardMetrics() {
  const { operatorData, isLoading } = useAVSContract()
  const [stake = 0n, fraudCount = 0n, isRegistered = false] = operatorData ?? [0n, 0n, false]

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Current Stake</h3>
          <p className="mt-2 text-2xl font-bold">{formatEther(stake)} ETH</p>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Fraud Count</h3>
          <p className="mt-2 text-2xl font-bold">{fraudCount.toString()}</p>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Status</h3>
          <p className="mt-2 text-2xl font-bold">{isRegistered ? 'Active' : 'Inactive'}</p>
        </div>
      </Card>
    </div>
  )
} 