import { ChainId } from './chains.js';
import { Provider } from '@ethersproject/abstract-provider';

type Resolvers = {
  lookupDomain: (
    domain: string,
    chainId: ChainId,
    provider: Provider
  ) => Promise<string | undefined>;
  lookupAddress: (
    address: string,
    chainId: ChainId,
    provider: Provider
  ) => Promise<string | undefined>;
};

type ServiceConfig = {
  resolvers: () => Promise<Resolvers>;
  chains: ReadonlyArray<ChainId>;
};

export type Service = 'ENS' | 'SpaceID' | 'UnstoppableDomains';

export const supportedServices: Record<Service, ServiceConfig> = {
  ENS: {
    resolvers: async () => await import('./resolvers/ens.js'),
    chains: [
      ChainId.Ethereum,
      ChainId.EthereumRopsten,
      ChainId.EthereumRinkeby,
      ChainId.EthereumGoerli,
    ],
  },
  SpaceID: {
    resolvers: async () => await import('./resolvers/space-id.js'),
    chains: [ChainId.BNB, ChainId.BNBTestnet, ChainId.Arbitrum, ChainId.ArbitrumGoerli],
  },
  UnstoppableDomains: {
    resolvers: async () => await import('./resolvers/unstoppable.js'),
    chains: [ChainId.Ethereum, ChainId.Polygon],
  },
} as const;

export const allServices = Object.keys(supportedServices) as Service[];
