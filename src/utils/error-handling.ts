import { ContractFunctionExecutionError } from 'viem'
import { toast } from 'react-hot-toast'

export type ContractError = {
  code: string
  message: string
  details?: unknown
}

export function handleContractError(error: unknown): ContractError {
  console.error('Contract error:', error)

  if (error instanceof ContractFunctionExecutionError) {
    // Handle specific contract errors
    if (error.message.includes('insufficient balance')) {
      toast.error('Insufficient balance')
      return { code: 'INSUFFICIENT_BALANCE', message: 'Insufficient balance' }
    }
    if (error.message.includes('operator slashed')) {
      toast.error('Operator has been slashed')
      return { code: 'OPERATOR_SLASHED', message: 'Operator has been slashed' }
    }
    if (error.message.includes('cooldown')) {
      toast.error('Withdrawal cooldown not met')
      return { code: 'COOLDOWN_NOT_MET', message: 'Withdrawal cooldown not met' }
    }
  }

  // Handle user rejected transactions
  if (error instanceof Error && error.message.includes('user rejected')) {
    toast.error('Transaction rejected by user')
    return { code: 'USER_REJECTED', message: 'Transaction rejected by user' }
  }

  // Handle network errors
  if (error instanceof Error && error.message.includes('network')) {
    toast.error('Network error occurred')
    return { code: 'NETWORK_ERROR', message: 'Network error occurred' }
  }

  // Default error
  toast.error('An unexpected error occurred')
  return { 
    code: 'UNKNOWN_ERROR', 
    message: error instanceof Error ? error.message : 'Unknown error',
    details: error
  }
} 