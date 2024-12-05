import { useStateSync } from '@/hooks/use-state-sync'
import { MOCK_TOKENS } from '@/config/tokens'

export function StateSync() {
  const { formattedBalance, poolReserves, pendingTransactions } = useStateSync(Object.values(MOCK_TOKENS))

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Network State</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Balance</h3>
            <p className="mt-1">{formattedBalance} ETH</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Pool Reserves</h3>
            <div className="mt-1 space-y-2">
              {Object.entries(poolReserves).map(([key, reserves]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}</span>
                  <span>
                    {reserves.token0Reserve.toString()} / {reserves.token1Reserve.toString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {pendingTransactions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pending Transactions</h3>
              <div className="mt-1 space-y-2">
                {pendingTransactions.map(tx => (
                  <div key={tx} className="font-mono text-sm">
                    {tx}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 