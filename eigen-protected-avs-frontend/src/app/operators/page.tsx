'use client'

import { useState } from 'react'
import { useOperatorContract } from '../../hooks/use-operator-contract' // Custom hook for contract interaction
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { LoadingSpinner } from '@/components/UI/loading-spinner'
import { useAccount } from '../../hooks/use-account'
import { ConnectButton } from '../../components/UI/connect-button'

interface Operator {
  address: string
  name: string
  pubKey: string
  registered: boolean
}

export default function OperatorRegistration() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const [operators, setOperators] = useState<Operator[]>([])
  const [formData, setFormData] = useState({
    name: '',
    pubKey: ''
  })

  const { registerAsOperator, getWalletAddress } = useOperatorContract() // Custom hook logic

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const walletAddress = await getWalletAddress()
      if (!walletAddress) {
        throw new Error('Wallet not connected')
      }

      // Call the smart contract to register the operator
      await registerAsOperator(walletAddress, formData.pubKey)

      // Add to local state after successful registration
      const newOperator: Operator = {
        address: walletAddress,
        name: formData.name,
        pubKey: formData.pubKey,
        registered: true
      }
      setOperators([...operators, newOperator])
      setFormData({ name: '', pubKey: '' })

      console.log('Operator registered successfully:', newOperator)
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Operator Registration</h1>
        <ConnectButton />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Register as Operator</CardTitle>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <p className="text-gray-500">Please connect your wallet to register</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Operator Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter operator name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Public Key</label>
                  <Input
                    value={formData.pubKey}
                    onChange={(e) => setFormData({ ...formData, pubKey: e.target.value })}
                    placeholder="Enter public key"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" /> : 'Register'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Registered Operators List */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Operators</CardTitle>
          </CardHeader>
          <CardContent>
            {operators.length === 0 ? (
              <p className="text-gray-500">No operators registered yet</p>
            ) : (
              <div className="space-y-4">
                {operators.map((operator, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="font-medium">{operator.name}</div>
                    <div className="text-sm text-gray-500 truncate">{operator.address}</div>
                    <div className="text-sm text-gray-500 truncate">{operator.pubKey}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
