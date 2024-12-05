'use client'

import { useState } from 'react'
import { usePublicClient, useAccount } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { brevisProofABI } from '@/web3/abis/brevis-proof'
import { toast } from 'sonner'

export function useFraudProof() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const publicClient = usePublicClient()
  const { address } = useAccount()

  const submitProof = async (operatorAddress: string, proof: string) => {
    if (!address || !publicClient) return

    try {
      setIsSubmitting(true)

      const isValid = await publicClient.readContract({
        address: HOLESKY_CONTRACTS.brevisProof,
        abi: brevisProofABI,
        functionName: 'verifyFraudProof',
        args: [proof as `0x${string}`, operatorAddress as `0x${string}`]
      })

      if (!isValid) {
        throw new Error('Invalid fraud proof')
      }

      // Submit to backend for processing
      const response = await fetch('/api/fraud-proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          operator: operatorAddress,
          proof,
          submitter: address 
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit proof')
      }

      toast.success('Fraud proof submitted successfully')
      return true
    } catch (error) {
      console.error('Proof submission error:', error)
      toast.error('Failed to submit fraud proof')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitProof,
    isSubmitting
  }
} 