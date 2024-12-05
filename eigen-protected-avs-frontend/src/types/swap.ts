export interface Token {
  symbol: string
  address: string
  decimals: number
  priceFeed: string
}

export interface SwapSimulationParams {
  inputToken: Token
  outputToken: Token
  inputAmount: bigint
  slippageTolerance: number // e.g., 0.5 for 0.5%
}

export interface SwapSimulationResult {
  estimatedOutput: bigint
  priceImpact: number
  minimumReceived: bigint
  fee: {
    base: bigint
    dynamic: bigint
    total: bigint
  }
  executionPrice: number
  route: Token[]
} 