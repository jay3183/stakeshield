'use client'

import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Chart, ChartConfiguration } from 'chart.js/auto'
import { type OperatorMetrics } from '@/hooks/use-avs-monitoring'
import { formatEther } from 'viem'

interface PerformanceChartProps {
  operators: OperatorMetrics[]
}

export function PerformanceChart({ operators }: PerformanceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart>()

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: operators.map(op => `${op.address.slice(0, 6)}...${op.address.slice(-4)}`),
        datasets: [
          {
            label: 'Performance Score',
            data: operators.map(op => op.performance),
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1
          },
          {
            label: 'Stake (ETH)',
            data: operators.map(op => Number(formatEther(op.stake))),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }

    chartInstance.current = new Chart(ctx, config)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [operators])

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-medium">Operator Performance</h3>
      <canvas ref={chartRef} />
    </Card>
  )
} 