'use client'

import { ResponsiveLine } from '@nivo/line'
import { useTheme } from '@/hooks/use-theme'
import { formatEther } from 'viem'
import { useContractEvents } from '@/hooks/use-contract-events'
import { useEffect, useState } from 'react'

interface DataPoint {
  x: string // timestamp
  y: number // stake amount
}

interface ChartData {
  id: string
  data: DataPoint[]
}

export function AdvancedStakeChart() {
  const { theme } = useTheme()
  const { events } = useContractEvents()
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    const stakeEvents = events
      .filter(e => e.type === 'StakeUpdated')
      .map(e => ({
        x: new Date(e.timestamp).toLocaleString(),
        y: parseFloat(formatEther(e.data.args.amount))
      }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())

    setData([{ id: 'Stake Amount', data: stakeEvents }])
  }, [events])

  return (
    <div className="h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Time',
          legendOffset: 40,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Stake (ETH)',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        enablePoints={true}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        theme={{
          textColor: theme === 'dark' ? '#fff' : '#333',
          grid: {
            line: {
              stroke: theme === 'dark' ? '#374151' : '#e5e7eb'
            }
          }
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle'
          }
        ]}
        motionConfig="gentle"
      />
    </div>
  )
} 