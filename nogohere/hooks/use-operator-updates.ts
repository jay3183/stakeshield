import { useState, useEffect } from 'react'

interface Operator {
  id: string
  address: string
  stake: string
  isFraud: boolean
  fraudCount: number
  registeredAt: string
  lastUpdateAt: string
  fraudEvents: any[]
}

export function useOperatorUpdates() {
  const [operators, setOperators] = useState<Operator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOperators() {
      const response = await fetch('http://localhost:3001/api/operators')
      const data = await response.json()
      setOperators(data)
      setLoading(false)
    }
    fetchOperators()
  }, [])

  return { operators, loading }
}