import { ContractFunctionExecutionError } from 'viem'

export function parseContractError(error: unknown): string {
  if (error instanceof ContractFunctionExecutionError) {
    // Extract the error message from the contract revert
    const match = error.message.match(/reverted with the following reason:\s*(.+)/)
    return match ? match[1] : error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unknown error occurred'
}

export function formatTransactionError(error: unknown): string {
  const errorMessage = parseContractError(error)

  // Map common error messages to user-friendly messages
  if (errorMessage.includes('insufficient funds')) {
    return 'Insufficient funds to complete transaction'
  }

  if (errorMessage.includes('user rejected')) {
    return 'Transaction was rejected'
  }

  return errorMessage || 'Transaction failed. Please check your inputs and try again.'
} 