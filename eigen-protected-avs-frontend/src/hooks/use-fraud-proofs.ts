'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export type FraudProof = {
  id: string
  proofId: string
  isValid: boolean
  timestamp: string
  operator: {
    address: string
  }
}

export function useFraudProofs() {
  const [proofs, setProofs] = useState<FraudProof[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProofs = async () => {
    try {
      const response = await fetch('/api/fraud-proofs')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch fraud proofs')
      }

      setProofs(data.proofs)
    } catch (error) {
      console.error('Error fetching fraud proofs:', error)
      toast.error('Failed to load fraud proofs')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProofs()
  }, [])

  return {
    proofs,
    isLoading,
    refetch: fetchProofs
  }
} 