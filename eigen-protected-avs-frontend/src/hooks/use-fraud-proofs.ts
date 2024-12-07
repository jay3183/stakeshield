'use client'

import { useState } from 'react'

export interface FraudProof {
  id: string
  operator: {
    address: string
  }
  proofId: string
  isValid: boolean
  timestamp: string
}

export function useFraudProofs() {
  const [proofs, setProofs] = useState<FraudProof[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitProof = async (proof: FraudProof) => {
    setIsSubmitting(true)
    try {
      setProofs(prev => [...prev, proof])
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    proofs,
    submitProof,
    isSubmitting
  } as const
} 