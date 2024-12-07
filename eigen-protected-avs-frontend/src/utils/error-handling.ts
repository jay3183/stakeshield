import { ContractFunctionExecutionError } from 'viem'

export function handleContractError(error: ContractFunctionExecutionError): string {
  // Extract the error message from the contract revert
  const message = error.message || ''
  
  // Check for common error patterns
  if (message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction'
  }
  
  if (message.includes('already registered')) {
    return 'Operator is already registered'
  }

  if (message.includes('minimum stake')) {
    return 'Stake amount is below minimum required'
  }

  if (message.includes('maximum stake')) {
    return 'Stake amount exceeds maximum allowed'
  }

  if (message.includes('not registered')) {
    return 'Operator is not registered'
  }

  // Return a generic error if no specific pattern is matched
  return 'Transaction failed. Please check your inputs and try again.'
} 