'use client'

import { useCallback, useState } from 'react'
import { useAccount, useContractWrite, useContractRead } from 'wagmi'
import { contracts } from '@/web3/config'
import { DelegationManagerABI } from '../web3/abis/delegation-manager'
import { parseEther } from 'ethers'

export function useOperatorContract() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  const { data: isOperator } = useContractRead({
    address: contracts.eigenLayer.delegationManager,
    abi: DelegationManagerABI,
    functionName: 'isOperator',
    args: [address as `0x${string}`],
    enabled: !!address
  })

  const registerOperator = useContractWrite({
    address: contracts.eigenLayer.delegationManager,
    abi: DelegationManagerABI,
    functionName: 'registerAsOperator'
  })

  const registerAsOperator = useCallback(async () => {
    if (!address) throw new Error('No address connected')
    setIsLoading(true)
    
    try {
      const tx = await registerOperator.writeAsync({
        args: [
          address as `0x${string}`,
          "0x0000000000000000000000000000000000000000",
          BigInt(50400)
        ],
        value: parseEther('0.05')
      })
      
      console.log("Transaction submitted:", tx)
      return tx
    } catch (error) {
      console.error("Registration error details:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [address, registerOperator])

  return { 
    registerAsOperator,
    isOperator: !!isOperator,
    isLoading,
    address 
  }
}