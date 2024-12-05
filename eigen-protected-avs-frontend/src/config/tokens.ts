import { Token } from '@/types/swap'

export const MOCK_TOKENS: Record<string, Token> = {
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