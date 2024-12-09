'use client'

import { Card } from '@/components/UI/card'
import { useOperatorContract } from '@/hooks/use-operator-contract'

export function RegisterOperator() {
  const { registerAsOperator, isLoading } = useOperatorContract()

  const handleRegister = async () => {
    console.log('Register button clicked')
    try {
      console.log('Calling registerAsOperator...')
      const result = await registerAsOperator()
      console.log('Registration result:', result)
    } catch (error: any) {
      console.error('Failed to register:', error)
      if (error.cause) {
        console.error('Error cause:', error.cause)
      }
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