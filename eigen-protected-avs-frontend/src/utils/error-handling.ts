import { ContractFunctionExecutionError } from 'viem'

export type ContractError = {
  code: string
  message: string
  details?: unknown
}

export function handleContractError(error: unknown): ContractError {
  if (error instanceof ContractFunctionExecutionError) {
    return {
      code: 'CONTRACT_ERROR',
      message: error.message
    }
  }
  return {
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'Unknown error'
  }
} 