'use client'

import { useEffect } from 'react'
import { usePublicClient, useContractEvent } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/web3/constants'
import { avsABI } from '@/web3/abis/avs'
import { useNotifications } from './use-notifications'

export function useRealTimeEvents() {
  const { addNotification } = useNotifications()

  useContractEvent({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: avsABI,
    eventName: 'StakeUpdated',
    listener(logs) {
      const log = logs[0]
      if (!log) return
      addNotification({
        type: 'success',
        title: 'Stake Updated',
        message: `New stake: ${log.args?.amount ?? 0} ETH`
      })
    }
  })

  useContractEvent({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: avsABI,
    eventName: 'OperatorSlashed',
    listener(logs) {
      const log = logs[0]
      if (!log) return
      const operator = log.args?.operator ?? '0x'
      addNotification({
        type: 'error',
        title: 'Operator Slashed',
        message: `Operator ${operator.slice(0, 6)}...${operator.slice(-4)} was slashed`
      })
    }
  })

  // Add more event listeners as needed
} 