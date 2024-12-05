'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useNotifications } from '@/hooks/use-notifications'
import { formatDistanceToNow } from 'date-fns'
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

interface SyncEvent {
  id: string
  timestamp: number
  status: 'success' | 'pending' | 'failed'
  data: string
  source: 'manual' | 'scheduled' | 'auto'
  latency?: number
  error?: string
}

interface SyncStats {
  totalSyncs: number
  successRate: number
  avgLatency: number
  nextScheduledSync?: number
}

export default function StateSyncPage() {
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(false)
  const [customStateData, setCustomStateData] = useState('')
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([])
  const [syncStats, setSyncStats] = useState<SyncStats>({
    totalSyncs: 0,
    successRate: 0,
    avgLatency: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const { addNotification } = useNotifications()
  const { 
    syncState, 
    isSyncing,
    syncEvents: contractSyncEvents,
    isLoadingSyncEvents 
  } = useAVSContract()

  const handleManualSync = async () => {
    if (!customStateData) {
      addNotification({
        message: 'Please enter state data',
        type: 'error'
      })
      return
    }

    setIsLoading(true)
    try {
      const tx = await syncState(customStateData)
      
      addNotification({
        message: 'State sync transaction submitted',
        type: 'success'
      })

      // Wait for confirmation
      await tx.wait()
      
      addNotification({
        message: 'State sync completed successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Sync error:', error)
      addNotification({
        message: error instanceof Error ? error.message : 'Failed to sync state',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Transform mock events into UI format
  useEffect(() => {
    if (syncEvents) {
      const formattedEvents = syncEvents.map(event => ({
        id: event.id,
        timestamp: Number(event.timestamp) * 1000,
        status: event.status as 'success' | 'pending' | 'failed',
        data: event.data,
        source: event.source as 'manual' | 'scheduled' | 'auto',
        latency: event.latency,
        error: event.error
      }))

      // Only update if the events have changed
      if (JSON.stringify(formattedEvents) !== JSON.stringify(syncEvents)) {
        setSyncEvents(formattedEvents)

        // Calculate stats
        setSyncStats({
          totalSyncs: formattedEvents.length,
          successRate: (formattedEvents.filter(e => e.status === 'success').length / formattedEvents.length) * 100,
          avgLatency: formattedEvents.reduce((acc, e) => acc + (e.latency || 0), 0) / formattedEvents.length,
          nextScheduledSync: Date.now() + 900000
        })
      }
    }
  }, [syncEvents]) // Only run when syncEvents changes

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">State Sync</h2>
        <Button 
          onClick={() => setIsAutoSyncEnabled(!isAutoSyncEnabled)}
          variant={isAutoSyncEnabled ? "default" : "outline"}
        >
          Auto Sync: {isAutoSyncEnabled ? 'Enabled' : 'Disabled'}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Syncs</h3>
            <p className="mt-2 text-3xl font-semibold">{syncStats.totalSyncs}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <p className="mt-2 text-3xl font-semibold">{syncStats.successRate}%</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg. Latency</h3>
            <p className="mt-2 text-3xl font-semibold">{syncStats.avgLatency}s</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Next Scheduled</h3>
            <p className="mt-2 text-lg font-semibold">
              {syncStats.nextScheduledSync 
                ? formatDistanceToNow(syncStats.nextScheduledSync)
                : 'Not scheduled'}
            </p>
          </div>
        </Card>
      </div>

      {/* Manual Sync and History */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Manual Sync Form */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Manual State Sync</h3>
            <div className="space-y-4">
              <textarea
                value={customStateData}
                onChange={(e) => setCustomStateData(e.target.value)}
                className="w-full h-32 p-2 border rounded"
                placeholder="Enter state data (e.g., ABI-encoded bytes)"
                disabled={isLoading}
              />
              <Button
                onClick={handleManualSync}
                disabled={isLoading || !customStateData}
                className="w-full"
              >
                {isLoading ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Sync History */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Syncs</h3>
            <div className="space-y-4">
              {syncEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Source: {event.source}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'success' 
                        ? 'bg-green-100 text-green-800'
                        : event.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}