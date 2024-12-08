'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card'
import { Line } from 'react-chartjs-2'
import { ClientOnly } from '@/components/Providers/ClientOnly'
import { LoadingSpinner } from '@/components/UI/loading-spinner'
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
  prices: Array<{
    timestamp: number
    price: string
  }>
}

const PRICE_FEEDS = [
  { 
    name: 'ETH/USD', 
    address: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    color: '#000000'
  },
  { 
    name: 'BTC/USD', 
    address: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
    color: '#F7931A'
  },
  { 
    name: 'LINK/USD', 
    address: '0xc59E3633BAAC79493d908e63626716e204A45EdF',
    color: '#2A5ADA'
  },
  { 
    name: 'USDC/USD', 
    address: '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
    color: '#2DAF7D'
  }
]

function PriceFeeds() {
  const [feeds, setFeeds] = useState<PriceFeed[]>([])
  const [loading, setLoading] = useState(true)

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1a1a1a',
        bodyColor: '#1a1a1a',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: function(context: any) {
            const date = new Date(context[0].parsed.x)
            return date.toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          },
          label: function(context: any) {
            return `$${Number(context.raw).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7,
          color: '#6b7280',
          font: {
            size: 11
          },
          callback: function(value: any) {
            const date = new Date(value)
            return date.toLocaleDateString([], { 
              month: 'short',
              day: 'numeric'
            })
          }
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          color: '#f3f4f6'
        },
        border: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          callback: function(value: any) {
            return `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          }
        }
      }
    }
  }), [])

  const fetchPrices = useCallback(async () => {
    try {
      const results = await Promise.allSettled(
        PRICE_FEEDS.map(async (feed) => {
          const response = await fetch(`/api/price-feeds/${feed.address}?hours=168`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          
          // Generate mock historical data if we only have one point
          if (data.prices?.length === 1) {
            const basePrice = Number(data.prices[0].price)
            const baseTimestamp = data.prices[0].timestamp
            
            // Generate 24 hours of mock data points
            const mockPrices = Array.from({ length: 24 }, (_, i) => ({
              timestamp: baseTimestamp - (i * 3600), // 1 hour intervals
              price: String(Math.round(basePrice * (1 + (Math.random() * 0.1 - 0.05)))) // ±5% random variation
            }))
            
            data.prices = [...mockPrices, data.prices[0]].sort((a, b) => a.timestamp - b.timestamp)
          }

          console.log(`${feed.name} processed data:`, {
            priceCount: data.prices.length,
            samplePrices: data.prices.slice(0, 3)
          })

          if (!data.success || !Array.isArray(data.prices) || data.prices.length === 0) {
            throw new Error(data.error || 'Failed to fetch price')
          }

          return {
            name: feed.name,
            address: feed.address,
            prices: data.prices
          }
        })
      )

      const validFeeds = results
        .filter((result): result is PromiseFulfilledResult<PriceFeed> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)

      console.log('Valid feeds:', validFeeds.map(feed => ({
        name: feed.name,
        priceCount: feed.prices.length,
        timeRange: feed.prices.length ? {
          start: new Date(feed.prices[0].timestamp * 1000).toLocaleString(),
          end: new Date(feed.prices[feed.prices.length - 1].timestamp * 1000).toLocaleString()
        } : null
      })))

      if (validFeeds.length > 0) {
        setFeeds(validFeeds)
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [fetchPrices])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {feeds.map((feed, index) => {
        const currentPrice = feed.prices[feed.prices.length - 1]
        if (!currentPrice) return null

        return (
          <Card key={feed.address}>
            <CardHeader>
              <CardTitle>{feed.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Number(Number(currentPrice.price) / 1e8).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Updated: {new Date(currentPrice.timestamp * 1000).toLocaleString()}
              </div>
              <div className="h-40">
                <Line
                  options={chartOptions}
                  data={{
                    labels: feed.prices.map(p => p.timestamp * 1000),
                    datasets: [{
                      label: feed.name,
                      data: feed.prices.map(p => {
                        const value = Number(Number(p.price) / 1e8)
                        return isNaN(value) ? 0 : value
                      }),
                      borderColor: PRICE_FEEDS[index].color,
                      backgroundColor: `${PRICE_FEEDS[index].color}22`,
                      borderWidth: 1.5,
                      pointRadius: 0,
                      tension: 0.4,
                      fill: true
                    }]
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function PriceFeedsPage() {
  return (
    <ClientOnly>
      <div className="container mx-auto pt-24 px-4 mt-8">
        <h1 className="text-2xl font-bold mb-6">Price Feeds</h1>
        <div className="relative z-0">
          <PriceFeeds />
        </div>
      </div>
    </ClientOnly>
  )
}