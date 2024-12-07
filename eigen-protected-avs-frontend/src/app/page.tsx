'use client'

import { DashboardMetrics } from '@/components/dashboard/metrics'
import { StakeForm } from '@/components/dashboard/stake-form'
import { Card } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <DashboardMetrics />
      
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Set Stake</h2>
          <StakeForm />
        </Card>
      </div>
    </div>
  )
}