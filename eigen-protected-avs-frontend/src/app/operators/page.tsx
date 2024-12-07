'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ManageOperator } from '@/components/operator/ManageOperator'
import { RegisterOperator } from '@/components/operator/RegisterOperator'
import { Card } from '@/components/ui/card'
import { useAVSContract } from '@/hooks/use-avs-contract'

export default function OperatorsPage() {
  const { address } = useAccount()
  const { operatorData, isLoadingOperator } = useAVSContract()
  const isRegistered = operatorData?.isRegistered ?? false

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Operator Management</h1>
      
      <div className="space-y-6">
        {!isRegistered ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Register as Operator</h2>
            <RegisterOperator />
          </Card>
        ) : (
          <ManageOperator />
        )}
      </div>
    </div>
  )
}