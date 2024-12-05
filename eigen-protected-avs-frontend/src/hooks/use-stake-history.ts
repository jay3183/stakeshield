import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { avsABI } from '@/web3/abis/avs'
import { CONTRACT_ADDRESSES } from '@/web3/constants'

type StakeEvent = {
  operator: string
  amount: bigint
  timestamp: number
  transactionHash: string
}

export function useStakeHistory(operatorAddress?: string) {
  const [history, setHistory] = useState<StakeEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    async function fetchHistory() {
      if (!operatorAddress) return

      try {
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
          event: avsABI.find(x => x.name === 'StakeUpdated'),
          args: {
            operator: operatorAddress
          },
          fromBlock: 0n
        })

        const events = await Promise.all(
          logs.map(async log => {
            const block = await publicClient.getBlock({ blockHash: log.blockHash })
            return {
              operator: log.args.operator,
              amount: log.args.amount,
              timestamp: Number(block.timestamp),
              transactionHash: log.transactionHash
            }
          })
        )

        setHistory(events)
      } catch (error) {
        console.error('Failed to fetch stake history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [operatorAddress, publicClient])

  return { history, isLoading }
} 