'use client'

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { avsABI } from '@/web3/abis/avs'
import { Log } from 'viem'
import toast from 'react-hot-toast'
import { WarningToast } from '@/components/toast/WarningToast'
import { createElement } from 'react'

export interface FraudEvent {
  operator: string
  proofId: string
  timestamp: number
  isValid: boolean
  details?: string
}

interface FraudProofArgs {
  operator: string
  proofId: string
  isValid: boolean
  timestamp?: bigint
}

// Add type for contract event logs
interface ContractEventLog {
  args: FraudProofArgs
  transactionHash: string
}

export function useFraudMonitoring() {
  const [fraudEvents, setFraudEvents] = useState<FraudEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!publicClient) return

    async function fetchEvents() {
      if (!publicClient) return
      
      try {
        const logs = await publicClient.getContractEvents({
          address: HOLESKY_CONTRACTS.avsHook,
          abi: avsABI,
          eventName: 'FraudProofVerified',
          fromBlock: 'earliest'
        })

        const events = (logs as unknown as ContractEventLog[]).map(log => {
          return {
            operator: log.args.operator,
            proofId: log.args.proofId,
            isValid: log.args.isValid,
            timestamp: Number(log.args.timestamp || 0n),
            details: `Fraud proof ${log.args.isValid ? 'verified' : 'rejected'} for operator ${log.args.operator.slice(0, 6)}...`
          }
        })

        setFraudEvents(events)
      } catch (error) {
        console.error('Failed to fetch fraud events:', error)
        toast.error('Failed to fetch fraud events')
      } finally {
        setIsLoading(false)
      }
    }

    // Watch for new fraud events
    const unwatch = publicClient.watchContractEvent({
      address: HOLESKY_CONTRACTS.avsHook,
      abi: avsABI,
      eventName: 'FraudProofVerified',
      onLogs: (logs) => {
        const newEvents = (logs as unknown as ContractEventLog[]).map(log => {
          const event: FraudEvent = {
            operator: log.args.operator,
            proofId: log.args.proofId,
            isValid: log.args.isValid,
            timestamp: Number(log.args.timestamp || 0n),
            details: `Fraud proof ${log.args.isValid ? 'verified' : 'rejected'} for operator ${log.args.operator.slice(0, 6)}...`
          }

          if (log.args.isValid) {
            toast.error(event.details || 'Fraud detected')
          } else {
            toast.custom(
              createElement(WarningToast, { 
                message: event.details || 'Fraud proof rejected' 
              }), 
              { duration: 5000 }
            )
          }
          return event
        })

        setFraudEvents(prev => [...newEvents, ...prev])
      }
    })

    fetchEvents()

    return () => {
      unwatch()
    }
  }, [publicClient])

  return {
    fraudEvents,
    isLoading
  }
} 