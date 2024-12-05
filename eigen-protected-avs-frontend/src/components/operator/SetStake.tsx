import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Alert } from '../ui/alert'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { parseEther } from 'viem'

export function SetStake() {
  const { address: connectedAddress } = useAccount()
  const [operatorAddress, setOperatorAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { stake, isStaking } = useAVSContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/operators/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operatorAddress: operatorAddress || connectedAddress,
          amount: Number(amount)
        })
      })

      if (!response.ok) throw new Error('Failed to set stake')
      
      // Reset form
      setOperatorAddress('')
      setAmount('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStake = async (amount: string) => {
    try {
      await stake({
        value: parseEther(amount)
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Card>
      <h2>Set Operator Stake</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Operator Address"
          placeholder="Enter operator address or use connected wallet"
          value={operatorAddress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOperatorAddress(e.target.value)}
        />
        <div className="text-sm text-gray-500">
          {!operatorAddress && connectedAddress && 
            `Using connected wallet address: ${connectedAddress}`
          }
        </div>
        <Input
          label="Stake Amount"
          type="number"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" loading={loading}>
          Set Stake
        </Button>
      </form>
    </Card>
  )
} 