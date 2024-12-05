'use client'

import { useState } from 'react'
import { useFraudVerifier } from '@/hooks/use-fraud-verifier'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function FraudProofForm() {
  const [proofId, setProofId] = useState('')
  const [operator, setOperator] = useState('')
  const [data, setData] = useState('')
  const { verifyProof, isVerifying } = useFraudVerifier()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await verifyProof(proofId, operator, data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Proof ID</label>
        <Input
          value={proofId}
          onChange={(e) => setProofId(e.target.value)}
          placeholder="0x..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Operator Address</label>
        <Input
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          placeholder="0x..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Proof Data</label>
        <Textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter proof data..."
          required
        />
      </div>
      <Button type="submit" disabled={isVerifying}>
        {isVerifying ? 'Verifying...' : 'Submit Proof'}
      </Button>
    </form>
  )
} 