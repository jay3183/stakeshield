'use client'

import { Card } from '@/components/ui/card'
import { formatUnits } from 'viem'
import { useState, useEffect } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Line } from 'react-chartjs-2'
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
  decimals: number
  lastUpdate: number
  price: string
  history: {
    timestamp: number
    price: string
  }[]
}

const PRICE_FEEDS = [
  {
    name: 'ETH/USD',
    address: '0x694AA1769357215DE4FAC081bf1f309aDC325306', // Sepolia ETH/USD
    color: 'rgb(59, 130, 246)', // blue
    historyEndpoint: '/api/price-feeds/eth-history'
  },
  {
    name: 'BTC/USD',
    address: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43', // Sepolia BTC/USD
    color: 'rgb(245, 158, 11)', // orange
    historyEndpoint: '/api/price-feeds/btc-history'
  },
  {
    name: 'LINK/USD',
    address: '0xc59E3633BAAC79493d908e63626716e204A45EdF', // Sepolia LINK/USD
    color: 'rgb(37, 99, 235)', // darker blue
    historyEndpoint: '/api/price-feeds/link-history'
  },
  {
    name: 'USDC/USD',
    address: '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E', // Sepolia USDC/USD
    color: 'rgb(34, 197, 94)', // green
    historyEndpoint: '/api/price-feeds/usdc-history'
  }
]

export default function PriceFeeds() {
  const [priceData, setPriceData] = useState<PriceFeed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const prices = await Promise.all(
          PRICE_FEEDS.map(async (feed) => {
            try {
              // Fetch current price
              const currentResponse = await fetch(`/api/price-feeds/${feed.address}`)
              const currentData = await currentResponse.json()
              
              if (currentData.error) {
                throw new Error(currentData.error)
              }

              // Fetch historical data
              const historyResponse = await fetch(feed.historyEndpoint)
              const historyData = await historyResponse.json()

              if (historyData.error) {
                throw new Error(historyData.error)
              }

              return {
                name: feed.name,
                address: feed.address,
                decimals: currentData.decimals,
                lastUpdate: currentData.timestamp,
                price: formatUnits(BigInt(currentData.price), currentData.decimals),
                history: historyData.prices.map((p: any) => ({
                  timestamp: p.timestamp,
                  price: formatUnits(BigInt(p.price), currentData.decimals)
                }))
              }
            } catch (feedError) {
              console.error(`Failed to fetch ${feed.name} price:`, feedError)
              return null
            }
          })
        )

        // Filter out failed feeds
        const validPrices = prices.filter((p): p is PriceFeed => p !== null)
        
        if (validPrices.length === 0) {
          setError('Failed to fetch any price feeds')
        } else {
          setPriceData(validPrices)
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
    const interval = setInterval(fetchPrices, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `$${Number(context.raw).toLocaleString()}`
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
          maxTicksLimit: 8,
          callback: function(this: any, tickValue: string | number, index: number, ticks: any[]): string {
            const date = new Date(Number(tickValue))
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return `$${value.toLocaleString()}`
          }
        }
      }
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Price Feeds</h1>

      {loading ? (
        <div className="flex justify-center p-6 md:p-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {priceData.map((feed, index) => (
            <Card key={feed.address} className="overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h2 className="text-lg md:text-xl font-semibold">{feed.name}</h2>
                  <span className="text-xs md:text-sm text-gray-500 mt-1 md:mt-0">
                    Last update: {new Date(feed.lastUpdate * 1000).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-4">
                  ${Number(feed.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <div className="h-40 md:h-48">
                  <Line
                    options={chartOptions}
                    data={{
                      labels: feed.history.map(h => h.timestamp * 1000),
                      datasets: [
                        {
                          label: feed.name,
                          data: feed.history.map(h => Number(h.price)),
                          borderColor: PRICE_FEEDS[index].color,
                          backgroundColor: `${PRICE_FEEDS[index].color}33`,
                          borderWidth: 2,
                          pointRadius: 0,
                          tension: 0.4,
                          fill: true
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}