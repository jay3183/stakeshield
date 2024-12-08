'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { LoadingSpinner } from '@/components/UI/loading-spinner'
import { toast } from 'react-hot-toast'

export function FraudCheck() {
  const [operatorAddress, setOperatorAddress] = useState('')
  const [proofId, setProofId] = useState('')
  const { verifyFraudProof, isLoading } = useAVSContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await verifyFraudProof(operatorAddress, proofId)
      if (result) {
        toast.error('Fraud detected!')
      } else {
        toast.success('No fraud detected')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify fraud proof')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Fraud Proof</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Operator Address</label>
            <Input
              type="text"
              placeholder="0x..."
              value={operatorAddress}
              onChange={(e) => setOperatorAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Proof ID</label>
            <Input
              type="text"
              placeholder="Enter proof ID"
              value={proofId}
              onChange={(e) => setProofId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !operatorAddress || !proofId}
            className="w-full"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Verify Proof'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 