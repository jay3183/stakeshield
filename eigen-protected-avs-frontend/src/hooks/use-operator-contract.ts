'use client'

import { useCallback, useState } from 'react'
import { useAccount, useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi'
import { contracts } from '@/web3/config'
import { toast } from 'react-hot-toast'
import { useAVSContract } from './use-avs-contract'
import { useLiquidityHooks } from './use-liquidity-hooks'
import { useBrevisProof } from './use-brevis-proof'

// Updated ABI with the correct functions
const DelegationManagerABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "earningsReceiver", "type": "address" },
          { "internalType": "address", "name": "delegationApprover", "type": "address" },
          { "internalType": "uint32", "name": "stakerOptOutWindowBlocks", "type": "uint32" }
        ],
        "internalType": "struct IDelegationManager.OperatorDetails",
        "name": "registeringOperatorDetails",
        "type": "tuple"
      },
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "registerAsOperator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "operator", "type": "address"}],
    "name": "isOperator",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

type OperatorDetails = {
  earningsReceiver: `0x${string}`,
  delegationApprover: `0x${string}`,
  stakerOptOutWindowBlocks: number
}

export function useOperatorContract() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const { registerInAvs } = useAVSContract()
  const { addStake } = useLiquidityHooks()
  const { checkForAnomalies } = useBrevisProof()

  // Read the current operator status
  const { data: isOperator } = useContractRead({
    address: contracts.eigenLayer.delegationManager,
    abi: DelegationManagerABI,
    functionName: 'isOperator',
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  console.log('Contract setup:', {
    delegationManager: contracts.eigenLayer.delegationManager,
    userAddress: address,
    isOperator
  })

  const { write: registerWrite } = useContractWrite({
    address: contracts.eigenLayer.delegationManager,
    abi: DelegationManagerABI,
    functionName: 'registerAsOperator'
  })

  const registerAsOperator = async () => {
    try {
      // 1. First run Brevis check
      const fraudCheck = await checkForAnomalies(address!, 'registration')
      if (fraudCheck.hasAnomalies) {
        throw new Error('Fraud check failed')
      }

      // 2. Register with EigenLayer
      if (!registerWrite) throw new Error('Write function not ready')
      
      const tx = await registerWrite({
        args: [{
          earningsReceiver: address!,
          delegationApprover: "0x0000000000000000000000000000000000000000" as `0x${string}`,
          stakerOptOutWindowBlocks: 0
        } as OperatorDetails, 
        ""]
      }) as unknown as { hash: `0x${string}` }
      if (!tx) throw new Error('Failed to submit registration')

      // 3. Wait for confirmation
      await useWaitForTransaction({
        hash: tx.hash,
        onSuccess() {
          toast.success('Successfully registered as operator')
        },
        onError(error) {
          toast.error('Registration failed: ' + error.message)
        }
      })

    } catch (error: any) {
      console.error('Registration process failed:', error)
      toast.error(error.message)
      throw error
    }
  }

  return { registerAsOperator, isLoading, isOperator }
}