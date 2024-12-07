'use client'

import { useState } from 'react'
import { usePublicClient, useContractWrite } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { avsABI } from '@/web3/abis/avs'
import { toast } from 'react-hot-toast'

export interface FraudProof {
  proofId: `0x${string}`
  operator: `0x${string}`
  evidence: `0x${string}`
  timestamp: number
}

export function useFraudProofs() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const publicClient = usePublicClient()
  const { writeContractAsync } = useContractWrite()

  const submitProof = async (proof: FraudProof) => {
    if (!publicClient) throw new Error('No provider available')
    setIsSubmitting(true)

    try {
      const hash = await writeContractAsync({
        address: HOLESKY_CONTRACTS.eigenLayer.hooks,
        abi: avsABI,
        functionName: 'verifyFraudProof',
        args: [proof.operator, proof.proofId, proof.evidence]
      })

      await publicClient.waitForTransactionReceipt({ hash })
      toast.success('Fraud proof submitted successfully')
    } catch (error) {
      console.error('Failed to submit fraud proof:', error)
      toast.error('Failed to submit fraud proof')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitProof,
    isSubmitting
  }
} 