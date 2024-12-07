'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { formatEther } from 'viem'
import { LoadingSpinner } from '../UI/loading-spinner'

export function DashboardMetrics() {
  const { operatorData, totalStaked, operatorCount, isLoading } = useAVSContract()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-500/90 to-blue-600/90 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/80">
            Your Stake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {operatorData?.stake ? formatEther(operatorData.stake) : '0'} ETH
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/90 to-purple-600/90 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/80">
            Total Staked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalStaked ? formatEther(totalStaked) : '0'} ETH
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/90 to-green-600/90 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/80">
            Total Operators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {operatorCount || 0}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500/90 to-orange-600/90 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/80">
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {operatorData?.isRegistered ? 'Active' : 'Not Registered'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 