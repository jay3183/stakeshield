'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { LoadingSpinner } from '@/components/UI/loading-spinner'
import { toast } from 'react-hot-toast'

export function OperatorRegistration() {
  const [earningsReceiver, setEarningsReceiver] = useState('')
  const { registerAsOperator, isLoading } = useAVSContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await registerAsOperator(earningsReceiver)
      toast.success('Successfully registered as operator')
    } catch (error: any) {
      toast.error(error.message || 'Failed to register')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register as Operator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Earnings Receiver Address
            </label>
            <Input
              type="text"
              placeholder="0x..."
              value={earningsReceiver}
              onChange={(e) => setEarningsReceiver(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !earningsReceiver}
            className="w-full"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 