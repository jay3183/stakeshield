'use client';

import { useCallback, useState, useEffect } from 'react'
import { useWriteContract, useAccount, usePublicClient } from 'wagmi'
import { parseEther } from 'viem'
import { HOLESKY_CONTRACTS } from '@/web3/constants'
import { WETHABI } from '../web3/abis/weth'
import { StrategyManagerABI } from '../web3/abis/strategy-manager'

export interface OperatorData {
  stake: bigint
  fraudCount: bigint
  isRegistered: boolean
}

export function useAVSContract() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContract } = useWriteContract()
  const [isLoadingOperator, setIsLoadingOperator] = useState(false)

  const setStake = useCallback(async (amount: string) => {
    if (!address || !publicClient) throw new Error('Wallet not connected')
    setIsLoadingOperator(true)
    
    try {
      // 1. Wrap ETH to WETH
      const wrapTx = await writeContract({
        address: HOLESKY_CONTRACTS.eigenLayer.weth,
        abi: WETHABI,
        functionName: 'deposit',
        value: parseEther(amount)
      }) as unknown as `0x${string}`
      await publicClient.waitForTransactionReceipt({ hash: wrapTx })

      // 2. Approve WETH spending
      const approveTx = await writeContract({
        address: HOLESKY_CONTRACTS.eigenLayer.weth,
        abi: WETHABI,
        functionName: 'approve',
        args: [HOLESKY_CONTRACTS.eigenLayer.strategyManager, parseEther(amount)]
      }) as unknown as `0x${string}`
      await publicClient.waitForTransactionReceipt({ hash: approveTx })

      // 3. Deposit into strategy
      const stakeTx = await writeContract({
        address: HOLESKY_CONTRACTS.eigenLayer.strategyManager,
        abi: StrategyManagerABI,
        functionName: 'depositIntoStrategy',
        args: [
          HOLESKY_CONTRACTS.eigenLayer.wethStrategy,
          HOLESKY_CONTRACTS.eigenLayer.weth,
          parseEther(amount)
        ]
      }) as unknown as `0x${string}`
      await publicClient.waitForTransactionReceipt({ hash: stakeTx })

    } finally {
      setIsLoadingOperator(false)
    }
  }, [address, publicClient, writeContract])

  return {
    setStake,
    isLoadingOperator
  }
}
