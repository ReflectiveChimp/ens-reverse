import { ChainId } from './chains.js';
import { Provider } from '@ethersproject/abstract-provider';

type ServiceConfig = {
  resolver: () => Promise<
    (address: string, chainId: ChainId, provider: Provider) => Promise<string | undefined>
  >;
  chains: ReadonlyArray<ChainId>;
};

export type Service = 'ENS' | 'SpaceID' | 'UnstoppableDomains';

export const supportedServices: Record<Service, ServiceConfig> = {
  ENS: {
    resolver: async () => (await import('./resolvers/ens.js')).lookupAddress,
    chains: [
      ChainId.Ethereum,
      ChainId.EthereumRopsten,
      ChainId.EthereumRinkeby,
      ChainId.EthereumGoerli,
    ],
  },
  SpaceID: {
    resolver: async () => (await import('./resolvers/space-id.js')).lookupAddress,
    chains: [ChainId.BNB, ChainId.BNBTestnet, ChainId.Arbitrum, ChainId.ArbitrumGoerli],
  },
  UnstoppableDomains: {
    resolver: async () => (await import('./resolvers/unstoppable.js')).lookupAddress,
    chains: [ChainId.Ethereum, ChainId.Polygon],
  },
} as const;

export const allServices = Object.keys(supportedServices) as Service[];
