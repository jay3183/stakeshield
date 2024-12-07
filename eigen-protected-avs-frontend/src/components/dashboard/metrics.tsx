'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { formatEther } from 'viem'

export function DashboardMetrics() {
  const { operatorData } = useAVSContract()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stake</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {operatorData ? formatEther(operatorData.stake) : '0'} ETH
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fraud Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {operatorData?.fraudCount?.toString() || '0'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {operatorData?.isRegistered ? 'Active' : 'Inactive'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 