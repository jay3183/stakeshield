'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { usePublicClient } from 'wagmi'
import { avsABI } from '@/web3/abis/avs'
import { CONTRACT_ADDRESSES } from '@/web3/constants'
import { formatEther, decodeEventLog } from 'viem'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type StakeUpdatedEvent = {
  eventName: string
  args: {
    operator: `0x${string}`
    amount: bigint
  }
}

interface StakeEvent {
  amount: bigint
  blockNumber: number
}

export function StakeChart() {
  const [stakeEvents, setStakeEvents] = useState<StakeEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const publicClient = usePublicClient()

  useEffect(() => {
    async function fetchEvents() {
      if (!publicClient) return;
      
      try {
        setLoading(true)
        setError(null)

        const currentBlock = await publicClient.getBlockNumber()
        
        const fromBlock = currentBlock - 1000n > 0n ? currentBlock - 1000n : 0n
        
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
          event: {
            type: 'event',
            name: 'StakeUpdated',
            inputs: [
              { type: 'address', name: 'operator', indexed: true },
              { type: 'uint256', name: 'amount', indexed: false }
            ]
          },
          fromBlock,
          toBlock: currentBlock
        })

        const events = logs.map(log => {
          const decoded = decodeEventLog({
            abi: avsABI,
            data: log.data,
            topics: log.topics,
          }) as unknown as StakeUpdatedEvent
          
          return {
            amount: decoded.args.amount,
            blockNumber: Number(log.blockNumber)
          }
        })

        setStakeEvents(events)
      } catch (error) {
        console.error('Failed to fetch stake events:', error)
        setError('Failed to load stake history')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [publicClient])

  const chartData = {
    labels: stakeEvents.map(event => `Block ${event.blockNumber}`),
    datasets: [
      {
        label: 'Stake Amount (ETH)',
        data: stakeEvents.map(event => Number(formatEther(event.amount))),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F633',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151',
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          color: '#374151',
        },
      },
      x: {
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          color: '#374151',
          maxRotation: 45,
          minRotation: 45,
          display: false
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-64 flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    )
  }

  if (stakeEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-64 flex items-center justify-center text-gray-500">
          No stake events in the last 1000 blocks
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold mb-4 text-gray-900">
        Stake History (Last 1000 blocks)
      </h2>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
} 