'use client'

import { DashboardMetrics } from '@/components/Dashboard/metrics'
import { StakeChart } from '@/components/Dashboard/stake-chart'
import { StakeOperator } from '@/components/Operator/StakeOperator'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card'

export default function Home() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Dashboard
      </h1>
      
      <DashboardMetrics />
      
      <div className="grid gap-6 md:grid-cols-2">
        <StakeChart />
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stake ETH</CardTitle>
            </CardHeader>
            <CardContent>
              <StakeOperator />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}