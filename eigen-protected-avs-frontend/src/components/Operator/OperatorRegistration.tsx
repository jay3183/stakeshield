'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { LoadingSpinner } from '@/components/UI/loading-spinner'
import { toast } from 'react-hot-toast'
import { useAccount } from 'wagmi'

export function OperatorRegistration() {
  const [earningsReceiver, setEarningsReceiver] = useState('')
  const { registerInAvs } = useAVSContract()
  const { address } = useAccount()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!address) {
        throw new Error('Wallet not connected')
      }
      
      if (!earningsReceiver) {
        throw new Error('Please enter an earnings receiver address')
      }

      await registerInAvs(earningsReceiver as `0x${string}`)
      toast.success('Successfully registered as operator')
    } catch (error: any) {
      console.error('Registration error:', error)
      const message = error.message?.includes('execution reverted') 
        ? 'Registration failed. Please ensure you have enough ETH (0.05) and try again.'
        : error.message || 'Failed to register'
      toast.error(message)
    }
  }

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Register as Operator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg text-blue-700">
            Please connect your wallet to register as an operator
          </div>
        </CardContent>
      </Card>
    )
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
            />
          </div>
          <Button 
            type="submit" 
            disabled={!earningsReceiver}
            className="w-full"
          >
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 