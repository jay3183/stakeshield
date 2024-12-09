'use client'

import { OperatorRegistration } from '@/components/OperatorRegistration'

export default function OperatorsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Operator Registration
      </h1>
      
      <OperatorRegistration />
    </div>
  )
}
