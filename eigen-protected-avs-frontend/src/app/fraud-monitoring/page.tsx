'use client'

import { FraudMonitor } from '@/components/fraud/FraudMonitor'
import { FraudProofForm } from '@/components/fraud/FraudProofForm'
import { FraudProofHistory } from '@/components/fraud/FraudProofHistory'

export default function FraudMonitoringPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <FraudProofForm />
          <FraudProofHistory />
        </div>
        <FraudMonitor />
      </div>
    </div>
  )
} 