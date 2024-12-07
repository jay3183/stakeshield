import { useState } from 'react'
import { useAVSContract } from '../../hooks/use-avs-contract'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { toast } from 'react-hot-toast'

export function SetStake() {
  const [amount, setAmount] = useState('')
  const { setStake, isLoadingOperator } = useAVSContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await setStake(amount)
      toast.success('Successfully staked WETH')
      setAmount('')
    } catch (err) {
      toast.error('Failed to stake: ' + (err as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in ETH"
        min="0.01"
        step="0.01"
      />
      <Button type="submit" disabled={isLoadingOperator}>
        {isLoadingOperator ? 'Staking...' : 'Stake'}
      </Button>
    </form>
  )
} 