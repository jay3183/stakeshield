'use client'

import { Card } from '@/components/ui/card'
import { formatEther } from 'viem'
import { type SystemMetrics as Metrics } from '@/hooks/use-avs-monitoring'
import { formatDistanceToNow } from 'date-fns'

interface SystemMetricsProps {
  metrics: Metrics
}

export function SystemMetrics({ metrics }: SystemMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Stake</h3>
        <p className="mt-2 text-3xl font-semibold">
          {formatEther(metrics.totalStake)} ETH
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Active Operators</h3>
        <p className="mt-2 text-3xl font-semibold">
          {metrics.activeOperators} / {metrics.totalOperators}
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Fraud Rate</h3>
        <p className="mt-2 text-3xl font-semibold">
          {(metrics.fraudRate * 100).toFixed(2)}%
        </p>
      </Card>
    </div>
  )
} 