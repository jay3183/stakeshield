'use client'

import { useState } from 'react'
import { useSwapContract } from '@/hooks/use-swap-contract'
import { SwapSimulator } from '@/lib/swap-simulator'
import { Token, SwapSimulationResult } from '@/types/swap'
import { formatUnits } from 'viem'
import { toast } from 'sonner'

const MOCK_TOKENS: Record<string, Token> = {
  WETH: {
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    priceFeed: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
  },
  USDC: {
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    priceFeed: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6'
  }
}

export default function SwapSimulationPage() {
  const [inputToken, setInputToken] = useState<Token>(MOCK_TOKENS.WETH)
  const [outputToken, setOutputToken] = useState<Token>(MOCK_TOKENS.USDC)
  const [inputAmount, setInputAmount] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [simulation, setSimulation] = useState<SwapSimulationResult | null>(null)

  const swapContract = useSwapContract()
  const simulator = new SwapSimulator(swapContract)

  const handleSimulate = async () => {
    if (!inputAmount) return

    try {
      const result = await simulator.simulateSwap({
        inputToken,
        outputToken,
        inputAmount: BigInt(inputAmount),
        slippageTolerance: Number(slippage)
      })

      setSimulation(result)
    } catch (error: any) {
      console.error('Simulation failed:', error)
      toast.error(error.message || 'Simulation failed')
    }
  }

  const handleSwap = async () => {
    if (!simulation || !inputAmount) return

    try {
      const hash = await simulator.executeSwap({
        inputToken,
        outputToken,
        inputAmount: BigInt(inputAmount),
        slippageTolerance: Number(slippage)
      })

      toast.success('Swap executed! Transaction: ' + hash)
    } catch (error: any) {
      console.error('Swap failed:', error)
      toast.error(error.message || 'Swap failed')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Swap Simulation</h1>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block mb-2">Input Token</label>
          <select 
            value={inputToken.symbol}
            onChange={(e) => setInputToken(MOCK_TOKENS[e.target.value])}
            className="w-full p-2 border rounded"
          >
            {Object.values(MOCK_TOKENS).map(token => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Output Token</label>
          <select 
            value={outputToken.symbol}
            onChange={(e) => setOutputToken(MOCK_TOKENS[e.target.value])}
            className="w-full p-2 border rounded"
          >
            {Object.values(MOCK_TOKENS).map(token => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Amount</label>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter amount..."
          />
        </div>

        <div>
          <label className="block mb-2">Slippage Tolerance (%)</label>
          <input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="w-full p-2 border rounded"
            step="0.1"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSimulate}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Simulate Swap
          </button>

          {simulation && (
            <button
              onClick={handleSwap}
              className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Execute Swap
            </button>
          )}
        </div>

        {simulation && (
          <div className="mt-6 p-4 border rounded">
            <h2 className="text-lg font-semibold mb-4">Simulation Results</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Estimated Output:</span>
                <span className="ml-2">
                  {formatUnits(simulation.estimatedOutput, outputToken.decimals)} {outputToken.symbol}
                </span>
              </div>
              <div>
                <span className="font-medium">Price Impact:</span>
                <span className="ml-2">{simulation.priceImpact.toFixed(2)}%</span>
              </div>
              <div>
                <span className="font-medium">Minimum Received:</span>
                <span className="ml-2">
                  {formatUnits(simulation.minimumReceived, outputToken.decimals)} {outputToken.symbol}
                </span>
              </div>
              <div>
                <span className="font-medium">Total Fee:</span>
                <span className="ml-2">
                  {formatUnits(simulation.fee.total, outputToken.decimals)} {outputToken.symbol}
                </span>
              </div>
              <div>
                <span className="font-medium">Execution Price:</span>
                <span className="ml-2">
                  1 {inputToken.symbol} = {simulation.executionPrice.toFixed(6)} {outputToken.symbol}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}