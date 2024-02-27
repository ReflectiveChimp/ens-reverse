import { ChainId } from '../chains.js';
import { Provider } from '@ethersproject/abstract-provider';
import { Contract } from '@ethersproject/contracts';
import { namehash } from '@ethersproject/hash';
import { normalizeAddress, ZERO_ADDRESS } from '../utils.js';

const registryAddresses: Partial<Record<ChainId, string>> = {
  [ChainId.BNB]: '0x08CEd32a7f3eeC915Ba84415e9C07a7286977956',
  [ChainId.Arbitrum]: '0x4a067EE58e73ac5E4a43722E008DFdf65B2bF348',
};

const registryAbi = [
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'resolver',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const resolverAbi = [
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'addr',
    outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const reverseResolverAbi = [
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export async function fetchResolverAddress(
  hash: string,
  chainId: ChainId,
  provider: Provider
): Promise<string | undefined> {
  const registryAddress = registryAddresses[chainId];
  if (!registryAddress) {
    return undefined;
  }

  const contract = new Contract(registryAddress, registryAbi, provider);
  try {
    const resolved = await contract.functions['resolver']!(hash);
    return resolved?.[0] || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Lookup the address for a domain name
 * @param domain Domain name
 * @param chainId Numeric chain ID
 * @param provider Ethers provider
 */
export async function lookupDomain(domain: string, chainId: ChainId, provider: Provider) {
  const hash = namehash(domain);
  if (!hash) {
    return undefined;
  }

  const resolverAddress = await fetchResolverAddress(hash, chainId, provider);
  if (!resolverAddress) {
    return undefined;
  }

  const resolverContract = new Contract(resolverAddress, resolverAbi, provider);
  try {
    const resolved = await resolverContract.functions['addr']!(hash);
    return normalizeAddress(resolved?.[0]);
  } catch {
    return undefined;
  }
}

/**
 * Lookup the domain name for an address
 * @param address Address
 * @param chainId Numeric chain ID
 * @param provider Ethers provider
 * @param confirm Whether to confirm the domain name resolves back to the address
 */
export async function lookupAddress(
  address: string,
  chainId: ChainId,
  provider: Provider,
  confirm: boolean = true
): Promise<string | undefined> {
  const reverseDomain = `${address.slice(2)}.addr.reverse`;
  const reverseHash = namehash(reverseDomain);
  if (!reverseHash) {
    return undefined;
  }

  const resolverAddress = await fetchResolverAddress(reverseHash, chainId, provider);
  if (!resolverAddress || resolverAddress === ZERO_ADDRESS) {
    return undefined;
  }

  const resolverContract = new Contract(resolverAddress, reverseResolverAbi, provider);
  try {
    const resolved = await resolverContract.functions['name']!(reverseHash);
    const domain = resolved?.[0] || undefined;

    if (!confirm || !domain) {
      return domain;
    }

    const resolvedAddress = await lookupDomain(domain, chainId, provider);
    if (resolvedAddress === address) {
      return domain;
    }

    return undefined;
  } catch {
    return undefined;
  }
}
