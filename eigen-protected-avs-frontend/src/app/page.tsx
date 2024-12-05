'use client'

import { DashboardMetrics } from '@/components/dashboard/metrics'
import { StakeForm } from '@/components/dashboard/stake-form'
import { Card } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      
      <DashboardMetrics />
      
      <Card className="w-full max-w-md mx-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Set Stake</h3>
          <StakeForm />
        </div>
      </Card>
    </div>
  )
}