import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Alert } from '../ui/alert'
import { useAVSContract } from '../../hooks/use-avs-contract'

export function RegisterOperator() {
  const { registerOperator, isRegistering } = useAVSContract()
  
  return (
    <Button 
      onClick={() => registerOperator()}
      disabled={isRegistering}
    >
      {isRegistering ? 'Registering...' : 'Register as Operator'}
    </Button>
  )
} 