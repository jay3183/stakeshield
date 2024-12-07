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
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { formatEther } from 'viem'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface StakeDataPoint {
  timestamp: number
  value: number
}

export function StakeChart() {
  const { getStakeHistory } = useAVSContract()
  const [data, setData] = useState<StakeDataPoint[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const history = await getStakeHistory()
      setData(history)
    }
    fetchData()
  }, [getStakeHistory])

  const chartData = {
    labels: data.map(d => new Date(d.timestamp * 1000).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Stake',
        data: data.map(d => Number(formatEther(BigInt(d.value)))),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stake History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}