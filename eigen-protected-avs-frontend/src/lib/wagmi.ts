import { createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { http } from 'viem'

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
})