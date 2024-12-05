'use client'

import { ErrorBoundary } from '@/components/ui/error-boundary'
import { DashboardMetrics } from './metrics'
import { NetworkStatus } from './network-status'
import { StakeChart } from './stake-chart'
import { TransactionHistory } from './transaction-history'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            EigenProtected AVS Dashboard
          </h1>
        </div>

        <div className="space-y-8">
          <ErrorBoundary>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <NetworkStatus />
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <DashboardMetrics />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <StakeChart />
              </div>
            </div>
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900">
                Transaction History
              </h2>
              <TransactionHistory />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
} 