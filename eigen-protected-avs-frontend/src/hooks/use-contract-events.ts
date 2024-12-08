'use client'

import { useEffect, useState } from 'react'
import { usePublicClient, useWatchContractEvent } from 'wagmi'
import { avsABI } from '@/web3/abis/avs'
import { CONTRACT_ADDRESSES } from '@/web3/constants'

interface ContractEvent {
  type: 'StakeUpdated' | 'OperatorSlashed' | 'FraudDetected' | 'ZKProofVerified'
  data: any
  timestamp: number
}

export function useContractEvents() {
  const [events, setEvents] = useState<ContractEvent[]>([])
  const publicClient = usePublicClient()

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[17000],
    abi: avsABI,
    eventName: 'StakeUpdated',
    onLogs(logs) {
      setEvents(prev => [{
        type: 'StakeUpdated',
        data: logs[0],
        timestamp: Date.now()
      }, ...prev])
    }
  })

  // Add other event listeners similarly
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[17000],
    abi: avsABI,
    eventName: 'OperatorSlashed',
    onLogs(logs) {
      setEvents(prev => [{
        type: 'OperatorSlashed',
        data: logs[0],
        timestamp: Date.now()
      }, ...prev])
    }
  })

  return { events }
} 