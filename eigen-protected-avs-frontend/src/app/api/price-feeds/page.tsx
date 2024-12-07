'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PriceFeed {
  name: string
  address: string
  price: string
  decimals: number
  timestamp: number
}

const PRICE_FEEDS = [
  { name: 'ETH/USD', address: '0x6D5Cc9CC3176C3CF61dc45c89618823411e5D03F' },
  { name: 'BTC/USD', address: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' },
  { name: 'LINK/USD', address: '0x48731cF7e84dc94C5f84577882c14Be11a5B7456' },
  { name: 'USDC/USD', address: '0x4b71a68da142Cf3A78d35ADfAB94742728C0f9B0' }
]

export default function PriceFeeds() {
  const [feeds, setFeeds] = useState<PriceFeed[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const updatedFeeds = await Promise.all(
          PRICE_FEEDS.map(async (feed) => {
            try {
              const response = await fetch(`/api/price-feeds/${feed.address}`)
              const data = await response.json()
              
              if (!data || data.error) {
                throw new Error(data?.error || 'Invalid response')
              }

              return {
                name: feed.name,
                address: feed.address,
                price: data.price?.toString() || '0',
                decimals: data.decimals || 8,
                timestamp: data.timestamp || Math.floor(Date.now() / 1000)
              }
            } catch (feedError) {
              console.error(`Failed to fetch ${feed.name} price:`, feedError)
              return null
            }
          })
        )

        const validFeeds = updatedFeeds.filter((feed): feed is PriceFeed => feed !== null)
        
        if (validFeeds.length === 0) {
          setError('No valid price feeds available')
        } else {
          setFeeds(validFeeds)
          setError(null)
        }
      } catch (error) {
        console.error('Failed to fetch prices:', error)
        setError('Failed to fetch price feeds')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {feeds.map((feed) => (
        <Card key={feed.address}>
          <CardHeader>
            <CardTitle>{feed.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(Number(feed.price) / Math.pow(10, feed.decimals)).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              Updated: {new Date(feed.timestamp * 1000).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}