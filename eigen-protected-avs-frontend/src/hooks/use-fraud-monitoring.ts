'use client'

import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { avsABI } from '@/web3/abis/avs'
import { brevisProofABI } from '@/web3/abis/brevis-proof'
import { toast } from 'sonner'
import { Log } from 'viem'

export type FraudEvent = {
  operator: string
  proofId: string
  timestamp: number
  verified: boolean
  details?: string
}

export function useFraudMonitoring() {
  const [fraudEvents, setFraudEvents] = useState<FraudEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  // Watch for fraud detection events
  useEffect(() => {
    if (!publicClient) return

    const unwatch = publicClient.watchContractEvent({
      address: HOLESKY_CONTRACTS.avsHook,
      abi: avsABI,
      eventName: 'FraudDetected',
      onLogs: async (logs: Log[]) => {
        const newEvents = await Promise.all(
          logs.map(async (log: any) => {
            const [operator, proofId] = log.args as [string, string]
            
            // Verify the fraud proof
            const isValid = await publicClient.readContract({
              address: HOLESKY_CONTRACTS.brevisProof,
              abi: brevisProofABI,
              functionName: 'verifyFraudProof',
              args: [proofId as `0x${string}`, operator as `0x${string}`]
            })

            const event: FraudEvent = {
              operator,
              proofId,
              timestamp: Number(log.blockTimestamp),
              verified: isValid,
              details: `Fraud detected for operator ${operator.slice(0, 6)}...`
            }

            toast.error(event.details)
            return event
          })
        )

        setFraudEvents(prev => [...newEvents, ...prev])
      }
    })

    return () => {
      unwatch()
    }
  }, [publicClient])

  return {
    fraudEvents,
    isLoading
  }
} 