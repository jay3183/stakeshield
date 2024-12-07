'use client'

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { avsABI } from '@/web3/abis/avs'
import { Log } from 'viem'

export interface VerificationEvent {
  operator: string
  proofId: string
  isValid: boolean
  timestamp: number
  transactionHash: string
}

interface FraudProofArgs {
  operator: string
  proofId: string
  isValid: boolean
  timestamp?: bigint
}

export function useVerificationHistory(operatorAddress?: string) {
  const [history, setHistory] = useState<VerificationEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    async function fetchHistory() {
      if (!publicClient || !operatorAddress) return

      try {
        const logs = await publicClient.getContractEvents({
          address: HOLESKY_CONTRACTS.eigenLayer.hooks,
          abi: avsABI,
          eventName: 'FraudProofVerified',
          fromBlock: 'earliest'
        })

        const events = logs
          .filter(log => {
            const args = log.args as unknown as FraudProofArgs
            return args.operator === operatorAddress
          })
          .map(log => {
            const args = log.args as unknown as FraudProofArgs
            return {
              operator: args.operator,
              proofId: args.proofId,
              isValid: args.isValid,
              timestamp: Number(args.timestamp || 0n),
              transactionHash: log.transactionHash || ''
            }
          })

        setHistory(events)
      } catch (error) {
        console.error('Failed to fetch verification history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [publicClient, operatorAddress])

  return { history, isLoading }
} 