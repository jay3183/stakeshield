'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/UI/card'
import { useOperatorUpdates } from '@/hooks/use-operator-updates'
import { useFraudMonitoring } from '@/hooks/use-fraud-monitoring'

export function OperatorsList() {
  const { operators, loading } = useOperatorUpdates()
  const { fraudEvents } = useFraudMonitoring()

  if (loading) {
    return <div>Loading operators...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {operators?.map((operator) => (
        <Card key={operator.id} className="p-4">
          <h3 className="text-lg font-bold">{operator.address}</h3>
          <div className="mt-2">
            <p>Stake: {operator.stake}</p>
            <p>Status: {operator.isFraud ? '❌ Fraudulent' : '✅ Valid'}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}