'use client'

import { FraudProofForm } from '@/components/fraud/FraudProofForm'
import { VerificationHistory } from '@/components/fraud/VerificationHistory'
import { Card } from '@/components/UI/card'

export default function FraudPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Fraud Monitoring</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Submit Fraud Proof</h2>
          <FraudProofForm />
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Verifications</h2>
          <VerificationHistory />
        </Card>
      </div>
    </div>
  )
} 