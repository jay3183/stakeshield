'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface TransactionFilters {
  type: 'all' | 'stake' | 'withdraw' | 'slash'
  status: 'all' | 'success' | 'failed' | 'pending'
  search: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
}

interface Props {
  onFilterChange: (filters: TransactionFilters) => void
}

export function TransactionFilters({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    status: 'all',
    search: '',
    dateRange: { from: null, to: null }
  })

  const handleChange = (key: keyof TransactionFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <select
          className="px-4 py-2 border rounded-md"
          value={filters.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="stake">Stake</option>
          <option value="withdraw">Withdraw</option>
          <option value="slash">Slash</option>
        </select>
        <select
          className="px-4 py-2 border rounded-md"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="date"
          className="px-4 py-2 border rounded-md"
          onChange={(e) => handleChange('dateRange', {
            ...filters.dateRange,
            from: e.target.value ? new Date(e.target.value) : null
          })}
        />
        <span>to</span>
        <input
          type="date"
          className="px-4 py-2 border rounded-md"
          onChange={(e) => handleChange('dateRange', {
            ...filters.dateRange,
            to: e.target.value ? new Date(e.target.value) : null
          })}
        />
      </div>
    </div>
  )
} 