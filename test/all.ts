import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '../src/chains.js';
import { lookupAddress, lookupDomain } from '../src/index.js';
import * as assert from 'node:assert';

describe('All', () => {
  const providers = {
    [ChainId.Ethereum]: new JsonRpcProvider('https://rpc.ankr.com/eth', ChainId.Ethereum),
    [ChainId.BNB]: new JsonRpcProvider('https://rpc.ankr.com/bsc', ChainId.BNB),
    [ChainId.Polygon]: new JsonRpcProvider('https://rpc.ankr.com/polygon', ChainId.Polygon),
  };

  describe('lookupAddress', () => {
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
      const expectedName = ['wendy.x'];
      const resolvedName = await lookupAddress(address, providers);
      assert.deepEqual(resolvedName, expectedName);
    });

    it('should resolve address to unstoppable domains name on ethereum', async () => {
      const address = '0xF40fE06c96Fb6be8cf1995dd039Bb59408656046';
      const expectedName = ['giacomochiarot.eth', 'giacomochiarot.crypto'];
      const resolvedName = await lookupAddress(address, providers);
      assert.deepEqual(resolvedName, expectedName);
    });
  });

  describe('lookupDomain', () => {
    it('should resolve ens name to address on ethereum mainnet', async () => {
      const domain = 'makoto.eth';
      const expectedAddress = '0xfFD1Ac3e8818AdCbe5C597ea076E8D3210B45df5';
      const resolvedAddress = await lookupDomain(domain, providers);
      assert.deepEqual(resolvedAddress, expectedAddress);
    });

    it('should resolve space id name to address on bnb chain', async () => {
      const domain = 'eddiez.bnb';
      const expectedAddress = '0x0e76a6dC9af8080b48C51E564e964CD15b9D6664';
      const resolvedAddress = await lookupDomain(domain, providers);
      assert.deepEqual(resolvedAddress, expectedAddress);
    });

    it('should resolve unstoppable domains name to address on polygon', async () => {
      const domain = 'wendy.x';
      const expectedAddress = '0x0C3aCC82348E261056FD9D43817F7cB441bb9CfC';
      const resolvedAddress = await lookupDomain(domain, providers);
      assert.deepEqual(resolvedAddress, expectedAddress);
    });

    it('should resolve address domains name to address on ethereum', async () => {
      const domain = 'giacomochiarot.crypto';
      const expectedAddress = '0xF40fE06c96Fb6be8cf1995dd039Bb59408656046';
      const resolvedAddress = await lookupDomain(domain, providers);
      assert.deepEqual(resolvedAddress, expectedAddress);
    });
  });
});
