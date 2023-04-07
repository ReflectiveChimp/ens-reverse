import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '../src/chains.js';
import { lookupAddress } from '../src/index.js';
import * as assert from 'node:assert';

describe('All', () => {
  describe('lookupAddress', () => {
    const providers = {
      [ChainId.Ethereum]: new JsonRpcProvider('https://rpc.ankr.com/eth', ChainId.Ethereum),
      [ChainId.BNB]: new JsonRpcProvider('https://rpc.ankr.com/bsc', ChainId.BNB),
      [ChainId.Polygon]: new JsonRpcProvider('https://rpc.ankr.com/polygon', ChainId.Polygon),
    };

    it('should resolve address to ens name on ethereum mainnet', async () => {
      const address = '0xfFD1Ac3e8818AdCbe5C597ea076E8D3210B45df5';
      const expectedName = ['makoto.eth'];
      const resolvedName = await lookupAddress(address, providers);
      assert.deepEqual(resolvedName, expectedName);
    });

    it('should resolve address to space id name on bnb chain', async () => {
      const address = '0x0e76a6dC9af8080b48C51E564e964CD15b9D6664';
      const expectedName = ['eddiez.bnb'];
      const resolvedName = await lookupAddress(address, providers);
      assert.deepEqual(resolvedName, expectedName);
    });

    it('should resolve address to unstoppable domains name on polygon', async () => {
      const address = '0x0C3aCC82348E261056FD9D43817F7cB441bb9CfC';
      const expectedName = ['wendyzhou.nft'];
      const resolvedName = await lookupAddress(address, providers);
      assert.deepEqual(resolvedName, expectedName);
    });
  });
});
