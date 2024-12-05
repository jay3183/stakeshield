'use client'

import { ManageOperator } from '@/components/operator/ManageOperator'

export default function OperatorsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Manage Operators</h1>
      <ManageOperator />
    </div>
  )
}