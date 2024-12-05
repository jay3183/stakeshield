'use client'

import { useState } from 'react'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { LoadingSpinner } from '../ui/loading-spinner'
import { formatEther } from 'viem'

export function StakeOperator() {
  const { address } = useAccount()
  const { stake, isStaking, operatorData, refetch } = useAVSContract()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  // Destructure operator data with default values
  const [currentStake = 0n] = operatorData ?? []

  const handleStake = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      setLoading(true)
      const hash = await stake(amount)
      toast.success('Successfully staked')
      await refetch()
      setAmount('')
    } catch (error) {
      console.error('Stake error:', error)
      toast.error('Failed to stake')
    } finally {
      setLoading(false)
    }
  }

  if (!address) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm font-medium">Current Stake:</span>
        <span className="ml-2">{formatEther(currentStake)} ETH</span>
      </div>
      
      <div className="flex gap-4">
        <Input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
        />
        <Button
          onClick={handleStake}
          disabled={loading || isStaking || !amount}
          className="w-32"
        >
          {loading || isStaking ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Stake'
          )}
        </Button>
      </div>
    </div>
  )
} 