import { useCallback, useState } from 'react'
import { useContractRead, useContractWrite, useAccount, usePublicClient } from 'wagmi'
import { parseEther, ContractFunctionExecutionError } from 'viem'
import { avsABI } from '@/web3/abis/avs'
import { CONTRACT_ADDRESSES } from '@/web3/constants'
import { toast } from 'react-hot-toast'
import { handleContractError } from '@/utils/error-handling'

// Define types for better type safety
export type OperatorData = {
  stake: bigint
  fraudCount: bigint
  isRegistered: boolean
}

export type StakeError = 
  | 'INSUFFICIENT_BALANCE'
  | 'INVALID_OPERATOR'
  | 'USER_REJECTED'
  | 'ALREADY_STAKED'
  | 'NETWORK_ERROR'
  | 'OPERATOR_SLASHED'
  | 'COOLDOWN_NOT_MET'

export type StakeStatus = {
  isLoading: boolean
  error: StakeError | null
  isSuccess: boolean
  transactionHash?: string
}

export function useAVSContract() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [error, setError] = useState<ContractError | null>(null)

  const {
    data: operatorData,
    isLoading: isLoadingOperator,
    error: operatorError,
    refetch: refetchOperator
  } = useContractRead({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: avsABI,
    functionName: 'operatorData',
    args: address ? [address as `0x${string}`] : undefined,
    enabled: !!address,
    watch: true,
    cacheTime: 5000,
    onError(err) {
      setError(handleContractError(err))
    }
  })

  const { writeAsync: setStake } = useContractWrite({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: avsABI,
    functionName: 'setOperatorStake',
    onError(err) {
      setError(handleContractError(err))
    }
  })

  const handleSetStake = useCallback(async (operatorAddress: `0x${string}`, amount: bigint) => {
    try {
      console.log('Setting stake:', {
        operator: operatorAddress,
        amount: amount.toString(),
        value: amount
      })

      const tx = await setStake({
        args: [operatorAddress, amount],
        value: amount
      })

      console.log('Transaction submitted:', tx)

      onNotification?.({
        message: `Transaction pending... Hash: ${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`,
        type: 'info'
      })

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx.hash
      })

      console.log('Transaction mined:', receipt)
      await refetchOperator()

      onNotification?.({
        message: 'Stake set successfully!',
        type: 'success'
      })

      return tx
    } catch (error) {
      console.error('Stake error:', error)
      
      let errorMessage = 'Failed to set stake'
      if (error instanceof ContractFunctionExecutionError) {
        if (error.message.includes('insufficient balance')) {
          errorMessage = 'Insufficient balance to set stake'
        } else if (error.message.includes('already staked')) {
          errorMessage = 'Operator already has a stake'
        }
      }

      onNotification?.({
        message: errorMessage,
        type: 'error'
      })
      throw error
    }
  }, [address, setStake, publicClient, onNotification, refetchOperator])

  return {
    operatorData,
    isLoadingOperator,
    error,
    handleSetStake,
    refetchOperator
  }
}