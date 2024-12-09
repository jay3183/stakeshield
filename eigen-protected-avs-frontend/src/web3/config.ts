import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { createConfig } from 'wagmi'
import { holesky } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'

const { connectors } = getDefaultWallets({
  appName: 'EigenProtected AVS',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [holesky],
})

export const config = createConfig({
  connectors,
  publicClient: createPublicClient({
    chain: holesky,
    transport: http()
  })
})

export const chains = [holesky]

// Contract addresses
export const contracts = {
  eigenLayer: {
    delegationManager: "0xA44151489861Fe9e3055d95adC98FbD462B948e7",
    strategyManager: "0xdfB5f6CE42aAA7830E94ECFCcAd411beF4D4D5b6",
    weth: "0x94373a4919B3240D86eA41593D5aBb7Cb5085849",
    wethStrategy: "0x80528D6e9A2BAbFc766965E0E26d5aB08D9CFaF9",
    delegationTerms: "0x959f9BE9D5C1Dfbae42d9F6DaA84cfd319Da85Be",
    brevisProof: "0x728b3c4c8b88ad54b8118d4c6a65fac35e4cab6b",
    brevisRequest: "0xce17b03d7901173cbfa017b1ae3a9b8632f42c18",
    
  }
} as const