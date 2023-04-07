import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '../src/chains.js';
import { lookupAddress } from '../src/resolvers/unstoppable.js';
import * as assert from 'node:assert';

describe('Unstoppable Domains', () => {
  describe('lookupAddress', () => {
    const provider = new JsonRpcProvider('https://rpc.ankr.com/polygon', ChainId.Polygon);

    it('should resolve address to name on polygon', async () => {
      const address = '0x0C3aCC82348E261056FD9D43817F7cB441bb9CfC';
      const expectedName = 'wendyzhou.nft';
      const resolvedName = await lookupAddress(address, ChainId.Polygon, provider);
      assert.equal(resolvedName, expectedName);
    });

    it('should not resolve address to name on when given address without reverse record', async () => {
      const address = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C';
      const expectedName = undefined;
      const resolvedName = await lookupAddress(address, ChainId.Polygon, provider);
      assert.equal(resolvedName, expectedName);
    });

    it('should return undefined when passed invalid address', async () => {
      const address = '0x0';
      const expectedName = undefined;
      const resolvedName = await lookupAddress(address, ChainId.Polygon, provider);
      assert.equal(resolvedName, expectedName);
    });
  });
});
