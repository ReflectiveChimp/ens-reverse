import { Provider } from '@ethersproject/abstract-provider';
import { ChainId } from './chains.js';
import { allServices, Service, supportedServices } from './config.js';
import { isDefined, isFulfilledResult } from './utils.js';

export { ChainId } from './chains.js';

export type Options = {
  services?: Service[];
};

const defaultOptions: Options = {
  services: allServices,
};

export async function lookupAddress(
  address: string,
  providers: Partial<Record<ChainId, Provider>>,
  options: Options = defaultOptions
): Promise<string[] | undefined> {
  const { wantedChains, services } = parseOptions(options, providers);
  if (services.length === 0) {
    return undefined;
  }

  const lookups = (
    await Promise.all(
      services.map(async serviceId => {
        const service = supportedServices[serviceId];
        const resolvers = await service.resolvers();
        return service.chains
          .filter(chain => wantedChains.includes(chain))
          .map(chain => resolvers.lookupAddress(address, chain, providers[chain]!));
      })
    )
  ).flat();

  const results = await Promise.allSettled(lookups);
  return results
    .filter(isFulfilledResult)
    .map(result => result.value)
    .filter(isDefined);
}

function parseOptions(options: Options, providers: Partial<Record<ChainId, Provider>>) {
  const opts = options ? { ...defaultOptions, ...options } : defaultOptions;
  const wantedChains: ChainId[] = Object.keys(providers).map(id => parseInt(id)) as ChainId[];
  if (wantedChains.length === 0) {
    return { wantedChains: [], services: [] };
  }

  const services = opts.services!.filter(service => {
    return wantedChains.some(chain => supportedServices[service].chains.includes(chain));
  });
  if (services.length === 0) {
    return { wantedChains: [], services: [] };
  }

  return { wantedChains, services };
}

export async function lookupDomain(
  domain: string,
  providers: Partial<Record<ChainId, Provider>>,
  options: Options = defaultOptions
): Promise<string | undefined> {
  const { wantedChains, services } = parseOptions(options, providers);
  if (services.length === 0) {
    return undefined;
  }

  const lookups = (
    await Promise.all(
      services.map(async serviceId => {
        const service = supportedServices[serviceId];
        const resolvers = await service.resolvers();
        return service.chains
          .filter(chain => wantedChains.includes(chain))
          .map(chain => resolvers.lookupDomain(domain, chain, providers[chain]!));
      })
    )
  ).flat();

  const results = await Promise.allSettled(lookups);
  const definedResults = results
    .filter(isFulfilledResult)
    .map(result => result.value)
    .filter(isDefined);

  return definedResults[0] || undefined;
}
