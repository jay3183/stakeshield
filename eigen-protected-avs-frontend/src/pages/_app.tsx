import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiConfig } from 'wagmi';
import { holesky } from 'wagmi/chains';
import { createPublicClient, http } from 'viem'
import type { AppProps } from 'next/app';

const chains = [holesky]
const publicClient = createPublicClient({
  chain: holesky,
  transport: http()
})

const { connectors } = getDefaultWallets({
  appName: 'EigenProtectedAVS',
  projectId: 'fd858a239e452208d47710719e711382'
});

const wagmiConfig = createConfig({
  chains: [holesky],
  connectors,
  transports: {
    [holesky.id]: http()
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;