'use client'

import { useCallback, useState } from 'react'
import { usePublicClient, useContractWrite, useWriteContract } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { avsABI } from '@/web3/abis/avs'
import { toast } from 'react-hot-toast'

export function useFraudProof() {
  const [isVerifying, setIsVerifying] = useState(false)
  const publicClient = usePublicClient()
  const { writeContract } = useWriteContract()

  const verifyFraudProof = async (
    operator: `0x${string}`, 
    proofId: `0x${string}`, 
    proofData: `0x${string}`
  ) => {
    return writeContract({
      address: HOLESKY_CONTRACTS.avsHook as `0x${string}`,
      abi: avsABI,
      functionName: 'verifyFraudProof',
      args: [operator, proofId, proofData]
    })
  }

  return {
    verifyFraudProof,
    isVerifying
  }
} 