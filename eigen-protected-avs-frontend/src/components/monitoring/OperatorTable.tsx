'use client'

import { type OperatorMetrics } from '@/hooks/use-avs-monitoring'
import { formatEther } from 'viem'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface OperatorTableProps {
  operators: OperatorMetrics[]
}

export function OperatorTable({ operators }: OperatorTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Stake</TableHead>
            <TableHead>Fraud Count</TableHead>
            <TableHead>Uptime</TableHead>
            <TableHead>Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operators.map((operator) => (
            <TableRow key={operator.address}>
              <TableCell className="font-mono">
                {operator.address.slice(0, 6)}...{operator.address.slice(-4)}
              </TableCell>
              <TableCell>{formatEther(operator.stake)} ETH</TableCell>
              <TableCell>{operator.fraudCount}</TableCell>
              <TableCell>{operator.uptime}%</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${operator.performance}%` }}
                    />
                  </div>
                  <span className="text-sm">{operator.performance}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 