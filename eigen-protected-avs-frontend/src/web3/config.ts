import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { holesky } from 'wagmi/chains'
import { http } from 'wagmi'

export const contracts = {
  eigenLayer: {
    delegationManager: '0xA44151489861Fe9e3055d95adC98FbD462B948e7' as `0x${string}`,
    strategyManager: '0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6' as `0x${string}`,
    weth: '0x94373a4919B3240D86eA41593D5aBb7Cb5085849' as `0x${string}`,
    wethStrategy: '0x80528D6e9A2BAbFc766965E0E26d5aB08D9CFaF9' as `0x${string}`,
    hooks: process.env.NEXT_PUBLIC_AVS_HOOK_ADDRESS as `0x${string}`
  },
  swap: {
    address: process.env.NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS as `0x${string}`
  }
}

export const config = getDefaultConfig({
  appName: 'EigenProtected AVS',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [holesky],
  transports: {
    [holesky.id]: http()
  }
}) 