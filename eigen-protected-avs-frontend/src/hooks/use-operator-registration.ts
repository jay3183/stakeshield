import { usePrepareContractWrite, useContractWrite, useAccount } from 'wagmi'
import { PrepareWriteContractConfig, waitForTransaction } from '@wagmi/core'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'
import { DelegationManagerABI } from '@/web3/abis/delegation-manager'
import { parseEther } from 'viem'

export function useOperatorRegistration() {
  const { address } = useAccount()

  const registrationValue = parseEther('0.05')
  
  const { config, isError, error } = usePrepareContractWrite({
    address: '0xA44151489861Fe9e3055d95adC98FbD462B948e7' as const,
    abi: DelegationManagerABI,
    functionName: 'registerAsOperator' as const,
    chainId: 17000,
    args: address ? [
      address as `0x${string}`,
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
      BigInt(50400)
    ] as readonly [`0x${string}`, `0x${string}`, bigint] : undefined,
    enabled: !!address,
    value: (address ? registrationValue : undefined) as unknown as undefined,
  })

  const { writeAsync, isLoading, isSuccess } = useContractWrite(config)

  useEffect(() => {
    if (isError && error) {
      console.error('Contract preparation error:', {
        error,
        address,
        config,
        errorMessage: error.message,
        cause: (error as any).cause
      })
      
      let errorMessage = 'Failed to prepare transaction'
      if (error.message) {
        if (error.message.includes('execution reverted')) {
          errorMessage = 'Contract requirements not met. Make sure you have enough ETH (0.05) and try again.'
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds to complete the transaction.'
        }
      }
      
      toast.error(errorMessage, { id: 'operator-register' })
    }
  }, [isError, error, address, config])

  const register = async () => {
    if (!address) {
      toast.error('Please connect your wallet first', { id: 'operator-register' })
      return
    }

    if (!writeAsync) {
      toast.error('Transaction cannot be prepared. Please try again.', { id: 'operator-register' })
      return
    }

    try {
      const toastId = 'operator-register'
      toast.loading('Preparing transaction...', { id: toastId })
      
      const tx = await writeAsync()
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: toastId })
      
      await waitForTransaction({ hash: tx.hash })
      toast.success('Successfully registered as operator!', { id: toastId })
    } catch (err: any) {
      console.error('Registration failed:', err)
      let errorMessage = 'Transaction failed. Please try again.'
      if (err?.message) {
        if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds to complete the transaction.'
        } else if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected.'
        }
      }
      toast.error(errorMessage, { id: 'operator-register' })
    }
  }

  return { register, isLoading, isSuccess }
} 