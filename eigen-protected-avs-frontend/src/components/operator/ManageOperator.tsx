'use client'

import { useState } from 'react'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { LoadingSpinner } from '../ui/loading-spinner'
import { StakeOperator } from './StakeOperator'

export function ManageOperator() {
  const { address } = useAccount()
  const { 
    registerOperator, 
    removeOperator, 
    isRegistering, 
    isRemoving, 
    operatorData, 
    refetch 
  } = useAVSContract()
  const [removeAddress, setRemoveAddress] = useState('')
  const [loading, setLoading] = useState(false)

  // Destructure operator data with default values
  const [stake = 0n, fraudCount = 0n, isRegistered = false] = operatorData ?? []

  const handleRegister = async () => {
    try {
      setLoading(true)
      const hash = await registerOperator()
      toast.success('Successfully registered as operator')
      await refetch()
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to register as operator')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    if (!isAddress(removeAddress)) {
      toast.error('Invalid address')
      return
    }

    try {
      setLoading(true)
      await removeOperator(removeAddress)
      toast.success('Successfully removed operator')
      await refetch()
      setRemoveAddress('')
    } catch (error) {
      console.error('Remove error:', error)
      toast.error('Failed to remove operator')
    } finally {
      setLoading(false)
    }
  }

  if (!address) {
    return (
      <div className="text-center py-8">
        Please connect your wallet to manage operators
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Operator Status</h2>
        <div className="space-y-4">
          <div>
            <span className="font-medium">Address:</span>
            <span className="ml-2">{address}</span>
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <span className={`ml-2 ${isRegistered ? 'text-green-600' : 'text-red-600'}`}>
              {isRegistered ? 'Registered' : 'Not Registered'}
            </span>
          </div>
          <div>
            <span className="font-medium">Current Stake:</span>
            <span className="ml-2">{stake.toString()} ETH</span>
          </div>
          <div>
            <span className="font-medium">Fraud Count:</span>
            <span className="ml-2">{fraudCount.toString()}</span>
          </div>
        </div>

        <div className="mt-6">
          {!isRegistered ? (
            <Button
              onClick={handleRegister}
              disabled={loading || isRegistering}
              className="w-full"
            >
              {loading || isRegistering ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Register as Operator'
              )}
            </Button>
          ) : (
            <>
              <StakeOperator />
              <div className="mt-6 space-y-4">
                <Input
                  placeholder="Operator address to remove"
                  value={removeAddress}
                  onChange={(e) => setRemoveAddress(e.target.value)}
                />
                <Button
                  onClick={handleRemove}
                  disabled={loading || isRemoving || !removeAddress}
                  variant="destructive"
                  className="w-full"
                >
                  {loading || isRemoving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Remove Operator'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 