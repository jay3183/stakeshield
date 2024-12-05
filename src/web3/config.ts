import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { http } from 'viem'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!walletConnectProjectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID')
}

export const config = getDefaultConfig({
  appName: 'EigenProtected AVS',
  projectId: walletConnectProjectId,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  }
})

export const chains = [sepolia] 