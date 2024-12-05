'use client'

import { useAVSMonitoring } from '@/hooks/use-avs-monitoring'
import { useAVSEvents } from '@/hooks/use-avs-events'
import { SystemMetrics } from '@/components/monitoring/SystemMetrics'
import { OperatorTable } from '@/components/monitoring/OperatorTable'
import { PerformanceChart } from '@/components/monitoring/PerformanceChart'
import { EventFeed } from '@/components/events/EventFeed'

export default function MonitoringPage() {
  const { metrics, operators, isLoading: metricsLoading } = useAVSMonitoring()
  const { events, isLoading: eventsLoading } = useAVSEvents()

  if (metricsLoading || !metrics) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading metrics...</h2>
          <p className="text-gray-500">Please wait while we fetch the latest data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">System Monitoring</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <SystemMetrics metrics={metrics} />
          <div className="mt-12">
            <PerformanceChart operators={operators} />
          </div>
          <div className="mt-12">
            <OperatorTable operators={operators} />
          </div>
        </div>
        
        <div>
          <EventFeed events={events} isLoading={eventsLoading} />
        </div>
      </div>
    </div>
  )
} 