'use client'

import { DashboardMetrics } from '@/components/Dashboard/metrics'
import { StakeForm } from '@/components/dashboard/stake-form'
import { Card } from '@/components/UI/card'

export default function DashboardPage() {
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