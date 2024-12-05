'use client'

import { useEffect, useState } from 'react'
import { usePublicClient, useContractEvent } from 'wagmi'
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

  useContractEvent({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: avsABI,
    eventName: 'StakeUpdated',
    listener(log) {
      setEvents(prev => [{
        type: 'StakeUpdated',
        data: log,
        timestamp: Date.now()
      }, ...prev])
    }
  })

  // Add other event listeners similarly
  useContractEvent({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: avsABI,
    eventName: 'OperatorSlashed',
    listener(log) {
      setEvents(prev => [{
        type: 'OperatorSlashed',
        data: log,
        timestamp: Date.now()
      }, ...prev])
    }
  })

  return { events }
} 