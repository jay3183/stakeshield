import { useEffect, useState } from 'react'
import { usePublicClient, useAccount } from 'wagmi'
import { useSwapContract } from './use-swap-contract'
import { Token } from '@/types/swap'
import { formatEther } from 'viem'
import { useEigenLayer } from './use-eigen-layer'
import { useBrevis } from './use-brevis'
import { usePriceFeeds } from './use-price-feeds'

interface SyncState {
  balance: bigint
  poolReserves: {
    [key: string]: {
      token0Reserve: bigint
      token1Reserve: bigint
    }
  }
  pendingTransactions: `0x${string}`[]
  operatorStatus: {
    status: number
    stake: bigint
  }
  prices: {
    [key: string]: bigint
  }
}

export function useStateSync(tokens: Token[]) {
  const [state, setState] = useState<SyncState>({
    balance: 0n,
    poolReserves: {},
    pendingTransactions: [],
    operatorStatus: {
      status: 0,
      stake: 0n
    },
    prices: {}
  })

  const { address } = useAccount()
  const publicClient = usePublicClient()
  const swapContract = useSwapContract()
  const eigenLayer = useEigenLayer()
  const brevis = useBrevis()
  const priceFeeds = usePriceFeeds()

  // Sync balance
  useEffect(() => {
    if (!address || !publicClient) return

    const syncBalance = async () => {
      const balance = await publicClient.getBalance({ address })
      setState(prev => ({ ...prev, balance }))
    }

    syncBalance()
    const interval = setInterval(syncBalance, 10000) // Every 10s
    return () => clearInterval(interval)
  }, [address, publicClient])

  // Sync pool reserves
  useEffect(() => {
    if (!swapContract) return

    const syncReserves = async () => {
      const reserves: SyncState['poolReserves'] = {}
      
      for (let i = 0; i < tokens.length; i++) {
        for (let j = i + 1; j < tokens.length; j++) {
          const [reserve0, reserve1] = await swapContract.getReserves(tokens[i], tokens[j])
          const key = `${tokens[i].address}-${tokens[j].address}`
          reserves[key] = { token0Reserve: reserve0, token1Reserve: reserve1 }
        }
      }

      setState(prev => ({ ...prev, poolReserves: reserves }))
    }

    syncReserves()
    const interval = setInterval(syncReserves, 30000) // Every 30s
    return () => clearInterval(interval)
  }, [tokens, swapContract])

  // Add EigenLayer sync
  useEffect(() => {
    if (!address) return

    const syncOperatorStatus = async () => {
      const status = await eigenLayer.getOperatorStatus(address)
      const stake = await eigenLayer.getOperatorStake(address)
      setState(prev => ({ 
        ...prev, 
        operatorStatus: { status, stake } 
      }))
    }

    syncOperatorStatus()
    const interval = setInterval(syncOperatorStatus, 30000)
    return () => clearInterval(interval)
  }, [address, eigenLayer])

  // Add price feed sync
  useEffect(() => {
    const syncPrices = async () => {
      const priceResults = await Promise.all(
        tokens.map(token => 
          priceFeeds.getLatestPrice(token.priceFeed)
            .catch(() => null)
        )
      )

      const priceMap = tokens.reduce((acc, token, i) => ({
        ...acc,
        [token.address]: priceResults[i]?.[1] ?? 0n // Get answer from Chainlink response
      }), {})

      setState(prev => ({ ...prev, prices: priceMap }))
    }

    syncPrices()
    const interval = setInterval(syncPrices, 30000)
    return () => clearInterval(interval)
  }, [tokens, priceFeeds])

  return {
    balance: state.balance,
    formattedBalance: formatEther(state.balance),
    poolReserves: state.poolReserves,
    pendingTransactions: state.pendingTransactions,
    operatorStatus: state.operatorStatus,
    prices: state.prices
  }
} 