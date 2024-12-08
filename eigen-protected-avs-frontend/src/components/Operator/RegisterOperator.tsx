'use client'

import { Card } from '@/components/UI/card'
import { useAVSContract } from '@/hooks/use-avs-contract'

export function RegisterOperator() {
  const { registerAsOperator, isLoading } = useAVSContract()

  const handleRegister = async () => {
    try {
      await registerAsOperator('0x0000000000000000000000000000000000000000')
    } catch (error: any) {
      console.error('Failed to register:', error)
    }
  }

  return (
    <div>
      <button 
        onClick={handleRegister}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Registering...' : 'Register as Operator'}
      </button>
    </div>
  )
}