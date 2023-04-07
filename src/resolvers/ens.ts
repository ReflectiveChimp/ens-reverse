import { Provider } from '@ethersproject/abstract-provider';
import { Contract } from '@ethersproject/contracts';
import { ChainId } from '../chains.js';

const reverseRecordsAddresses: Partial<Record<ChainId, string>> = {
  [ChainId.Ethereum]: '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C',
  [ChainId.EthereumRopsten]: ' 0x72c33B247e62d0f1927E8d325d0358b8f9971C68',
  [ChainId.EthereumRinkeby]: '0x196eC7109e127A353B709a20da25052617295F6f',
  [ChainId.EthereumGoerli]: '0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e',
};

const reverseRecordsAbi = [
  {
    inputs: [{ internalType: 'address[]', name: 'addresses', type: 'address[]' }],
    name: 'getNames',
    outputs: [{ internalType: 'string[]', name: 'r', type: 'string[]' }],
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
