'use client'

import { useState } from 'react'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function ManageOperator() {
  const { address } = useAccount()
  const { registerOperator } = useAVSContract()
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegister = async () => {
    if (!address) return
    
    setIsRegistering(true)
    try {
      await registerOperator()
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button 
        onClick={handleRegister}
        disabled={isRegistering || !address}
        className="w-full"
      >
        {isRegistering ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Registering...</span>
          </div>
        ) : (
          'Register as Operator'
        )}
      </Button>
    </div>
  )
} 