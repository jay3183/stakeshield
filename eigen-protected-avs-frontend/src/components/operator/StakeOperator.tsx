'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { LoadingSpinner } from '@/components/UI/loading-spinner'
import { toast } from 'react-hot-toast'
import { parseEther } from 'viem'

export function StakeOperator() {
  const [amount, setAmount] = useState('')
  const { stakeWETH, isLoading } = useAVSContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const parsedAmount = parseEther(amount)
      await stakeWETH(parsedAmount)
      toast.success('Successfully staked WETH')
      setAmount('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to stake')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stake WETH</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Amount (ETH)
            </label>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !amount}
            className="w-full"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Stake ETH'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 