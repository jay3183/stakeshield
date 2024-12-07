'use client'

import { useState } from 'react'
import { Modal } from '../ui/modal'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { DelegationManagerABI } from '@/config/abis'

interface AddOperatorProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (address: string, stake: string) => Promise<void>
}

export function AddOperator({ isOpen, onClose, onAdd }: AddOperatorProps) {
  const [address, setAddress] = useState('')
  const [stake, setStake] = useState('')
  const [loading, setLoading] = useState(false)
  const { isConnected, address: connectedAddress } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isConnected || !walletClient || !connectedAddress) return
    
    setLoading(true)
    try {
      if (!publicClient) return

      // First check if address is already an operator
      const isOperator = await publicClient.readContract({
        address: HOLESKY_CONTRACTS.eigenLayer.delegationManager,
        abi: DelegationManagerABI.abi,
        functionName: 'isOperator',
        args: [address as `0x${string}`]
      })

      if (!isOperator) {
        // Register as operator first
        const operatorDetails = {
          earningsReceiver: address as `0x${string}`,
          delegationApprover: '0x0000000000000000000000000000000000000000' as `0x${string}`,
          stakerOptOutWindowBlocks: 0n
        } as const

        const tx = await walletClient.writeContract({
          address: HOLESKY_CONTRACTS.eigenLayer.delegationManager,
          abi: DelegationManagerABI.abi,
          functionName: 'registerAsOperator',
          args: [operatorDetails, '']
        })

        // Wait for transaction confirmation
        await publicClient.waitForTransactionReceipt({ hash: tx })
      }

      // Now add stake
      await onAdd(address, stake)
      onClose()
    } catch (error) {
      console.error('Failed to add operator:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Operator">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Operator Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="0x..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stake Amount (ETH)</label>
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="0.0"
            step="0.01"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register & Add Stake'}
          </button>
        </div>
      </form>
    </Modal>
  )
} 