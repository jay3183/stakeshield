import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { type Chain } from 'viem'

const holeskyChain: Chain = {
  id: 17000,
  name: 'Holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'Holesky ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://ethereum-holesky.publicnode.com'] },
    public: { http: ['https://ethereum-holesky.publicnode.com'] },
  },
}

export const chains = [holeskyChain] as const

export const config = getDefaultConfig({
  appName: 'EigenProtected AVS',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',
  chains,
})