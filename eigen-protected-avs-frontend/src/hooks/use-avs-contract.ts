'use client';

import { useCallback, useState } from 'react'
import { useAccount, usePublicClient, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { contracts } from '@/web3/config'
import { DelegationManagerABI } from '../web3/abis/delegation-manager'
import { StrategyManagerABI } from '../web3/abis/strategy-manager'
import { WETHABI } from '../web3/abis/weth'

interface StakeDataPoint {
  timestamp: number
  value: number
}

export interface OperatorData {
  stake: bigint
  isRegistered: boolean
}

export function useAVSContract() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)
  const [operatorData, setOperatorData] = useState<OperatorData | null>(null)
  const [totalStaked, setTotalStaked] = useState<bigint>(BigInt(0))
  const [operatorCount, setOperatorCount] = useState<number>(0)

  const registerAsOperator = useCallback(async () => {
    if (!address) throw new Error('No address connected')
    setIsLoading(true)

    try {
      const hash = await writeContractAsync({
        address: contracts.eigenLayer.delegationManager,
        abi: DelegationManagerABI,
        functionName: 'registerAsOperator',
        args: [address, "0x0000000000000000000000000000000000000000"]
      })

      await publicClient?.waitForTransactionReceipt({ hash })
      return hash
    } finally {
      setIsLoading(false)
    }
  }, [address, publicClient, writeContractAsync])

  const stakeWETH = useCallback(async (amount: string) => {
    if (!address) throw new Error('No address connected')
    setIsLoading(true)

    try {
      const stakeAmount = parseEther(amount)

      // 1. Wrap ETH
      const wrapHash = await writeContractAsync({
        address: contracts.eigenLayer.weth,
        abi: WETHABI,
        functionName: 'deposit',
        value: stakeAmount
      })
      await publicClient?.waitForTransactionReceipt({ hash: wrapHash })

      // 2. Approve WETH
      const approveHash = await writeContractAsync({
        address: contracts.eigenLayer.weth,
        abi: WETHABI,
        functionName: 'approve',
        args: [contracts.eigenLayer.strategyManager, stakeAmount]
      })
      await publicClient?.waitForTransactionReceipt({ hash: approveHash })

      // 3. Stake WETH
      const stakeHash = await writeContractAsync({
        address: contracts.eigenLayer.strategyManager,
        abi: StrategyManagerABI,
        functionName: 'depositIntoStrategy',
        args: [
          contracts.eigenLayer.wethStrategy,
          contracts.eigenLayer.weth,
          stakeAmount
        ]
      })
      await publicClient?.waitForTransactionReceipt({ hash: stakeHash })

      return stakeHash
    } finally {
      setIsLoading(false)
    }
  }, [address, publicClient, writeContractAsync])

  const getStakeHistory = async () => {
    const history: StakeDataPoint[] = [
      { timestamp: Date.now() / 1000 - 86400 * 7, value: 100 },
      { timestamp: Date.now() / 1000 - 86400 * 6, value: 150 },
      { timestamp: Date.now() / 1000 - 86400 * 5, value: 200 },
      { timestamp: Date.now() / 1000 - 86400 * 4, value: 180 },
      { timestamp: Date.now() / 1000 - 86400 * 3, value: 250 },
      { timestamp: Date.now() / 1000 - 86400 * 2, value: 300 },
      { timestamp: Date.now() / 1000 - 86400, value: 280 }
    ]
    return history
  }

  return {
    registerAsOperator,
    stakeWETH,
    getStakeHistory,
    operatorData,
    totalStaked,
    operatorCount,
    isLoading
  }
}