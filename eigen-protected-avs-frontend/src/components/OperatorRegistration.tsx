import { useOperatorRegistration } from '@/hooks/use-operator-registration'
import { useAccount } from 'wagmi'

export function OperatorRegistration() {
  const { address } = useAccount()
  const { register } = useOperatorRegistration()

  const handleRegister = async () => {
    try {
      await register()
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">
          Operator Registration
        </h1>

        <div className="space-y-6">
          {!address ? (
            <div className="bg-blue-50 p-4 rounded-lg text-blue-700">
              Please connect your wallet to register as an operator
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Register as an operator to participate in the StakeShield network
              </p>
              
              <button
                onClick={handleRegister}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Register as Operator
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 