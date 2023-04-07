import { ChainId } from '../chains.js';
import { Provider } from '@ethersproject/abstract-provider';
import { Contract } from '@ethersproject/contracts';

const registryAddresses: Partial<Record<ChainId, string>> = {
  [ChainId.Ethereum]: '0x049aba7510f45BA5b64ea9E658E342F904DB358D',
  [ChainId.Polygon]: '0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f',
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
