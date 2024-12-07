import { createConfig, http } from 'wagmi'
import { type Chain, holesky } from 'wagmi/chains'

export const chains: readonly [Chain, ...Chain[]] = [holesky]

export const config = createConfig({
  chains,
  transports: {
    [holesky.id]: http()
  }
}) 