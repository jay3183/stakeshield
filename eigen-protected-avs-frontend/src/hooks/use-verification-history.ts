'use client'

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { fraudVerifierABI } from '@/web3/abis/fraud-verifier'

export type Verification = {
  id: string
  proofId: string
  operator: string
  isValid: boolean
  timestamp: number
}

export function useVerificationHistory() {
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!publicClient) return

    const fetchVerifications = async () => {
      try {
        const logs = await publicClient.getLogs({
          address: HOLESKY_CONTRACTS.fraudVerifier,
          events: [fraudVerifierABI[1]], // FraudProofVerified event
          fromBlock: 'earliest'
        })

        const processedVerifications = logs.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          proofId: (log as any).args.proofId,
          operator: (log as any).args.operator,
          isValid: (log as any).args.isValid,
          timestamp: Number((log as any).timestamp)
        }))

        setVerifications(processedVerifications)
      } catch (error) {
        console.error('Error fetching verifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVerifications()
  }, [publicClient])

  return { verifications, isLoading }
} 