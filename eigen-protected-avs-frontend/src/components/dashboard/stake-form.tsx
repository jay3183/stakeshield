'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { parseEther } from 'viem'
import { toast } from 'react-hot-toast'

export function StakeForm() {
  const { stake, isStaking } = useAVSContract()
  const [amount, setAmount] = useState('')
  const { address } = useAccount()

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return

    try {
      // Convert ETH to Wei and stake
      const value = parseEther(amount)
      await stake({ value })

      toast.success('Successfully staked in EigenLayer and AVS')
      setAmount('')
    } catch (error) {
      console.error('Stake error:', error)
      toast.error('Failed to stake')
    }
  }

  if (!address) return <div>Please connect your wallet</div>

  return (
    <div className="space-y-4">
      <form onSubmit={handleStake} className="space-y-4">
        <input 
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter stake amount in ETH"
          disabled={isStaking}
        />
        <button 
          type="submit"
          disabled={isStaking || !amount}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isStaking ? 'Staking...' : 'Stake'}
        </button>
      </form>
    </div>
  )
} 