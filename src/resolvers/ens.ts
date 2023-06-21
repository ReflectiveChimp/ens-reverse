import { Provider } from '@ethersproject/abstract-provider';
import { Contract } from '@ethersproject/contracts';
import { ChainId } from '../chains.js';
import { namehash } from '@ethersproject/hash';
import { normalizeAddress } from '../utils.js';

const registryAddresses: Partial<Record<ChainId, string>> = {
  [ChainId.Ethereum]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
};

const reverseRecordsAddresses: Partial<Record<ChainId, string>> = {
  [ChainId.Ethereum]: '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C',
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

const reverseRecordsAbi = [
  {
    inputs: [{ internalType: 'address[]', name: 'addresses', type: 'address[]' }],
    name: 'getNames',
    outputs: [{ internalType: 'string[]', name: 'r', type: 'string[]' }],
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
 */
export async function lookupAddress(
  address: string,
  chainId: ChainId,
  provider: Provider
): Promise<string | undefined> {
  const reverseRecordsAddress = reverseRecordsAddresses[chainId];
  if (!reverseRecordsAddress) {
    return undefined;
  }

  const contract = new Contract(reverseRecordsAddress, reverseRecordsAbi, provider);
  try {
    const domains = await contract.functions['getNames']!([address]);
    return domains?.[0]?.[0] || undefined;
  } catch {
    return undefined;
  }
}
