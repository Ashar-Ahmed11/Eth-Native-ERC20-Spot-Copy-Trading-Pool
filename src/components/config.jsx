import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import hardhat from '../chains/customChain'
export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
})