import { ChainId } from '../chains.js';
import { Provider } from '@ethersproject/abstract-provider';
import { Contract } from '@ethersproject/contracts';
import { namehash } from '@ethersproject/hash';
import { normalizeAddress } from '../utils.js';

// https://docs.unstoppabledomains.com/smart-contracts/contract-reference/uns-smart-contracts/#unsregistry
const registryAddresses: Partial<Record<ChainId, string>> = {
  [ChainId.Ethereum]: '0x049aba7510f45BA5b64ea9E658E342F904DB358D',
  [ChainId.Polygon]: '0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f',
};

// https://docs.unstoppabledomains.com/smart-contracts/contract-reference/uns-smart-contracts/#proxyreader
const proxyReaderAddresses: Partial<Record<ChainId, string>> = {
  [ChainId.Ethereum]: '0x58034A288D2E56B661c9056A0C27273E5460B63c',
  [ChainId.Polygon]: '0x423F2531bd5d3C3D4EF7C318c2D1d9BEDE67c680',
};

const registryAbi = [
  {
    inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
    name: 'reverseNameOf',
    outputs: [{ internalType: 'string', name: 'reverseUri', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const proxyReaderAbi = [
  {
    inputs: [
      { internalType: 'string[]', name: 'keys', type: 'string[]' },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getMany',
    outputs: [{ internalType: 'string[]', name: 'values', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
];

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

  const proxyReaderAddress = proxyReaderAddresses[chainId];
  if (!proxyReaderAddress) {
    return undefined;
  }

  const proxyReaderContract = new Contract(proxyReaderAddress, proxyReaderAbi, provider);
  try {
    const data = await proxyReaderContract.functions['getMany']!(['crypto.ETH.address'], hash);
    return normalizeAddress(data?.[0]?.[0]);
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
  const registryAddress = registryAddresses[chainId];
  if (!registryAddress) {
    return undefined;
  }

  const contract = new Contract(registryAddress, registryAbi, provider);
  try {
    const domain = await contract.functions['reverseNameOf']!(address);
    return domain?.[0] || undefined;
  } catch {
    return undefined;
  }
}
