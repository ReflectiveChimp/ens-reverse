import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '../src/chains.js';
import { lookupAddress, lookupDomain } from '../src/resolvers/unstoppable.js';
import * as assert from 'node:assert';

describe('Unstoppable Domains', () => {
  const polygonProvider = new JsonRpcProvider('https://rpc.ankr.com/polygon', ChainId.Polygon);
  const ethereumProvider = new JsonRpcProvider('https://rpc.ankr.com/eth', ChainId.Ethereum);

  describe('lookupAddress', () => {
    it('should resolve address to name on polygon', async () => {
      const address = '0x0C3aCC82348E261056FD9D43817F7cB441bb9CfC';
      const expectedName = 'wendyzhou.nft';
      const resolvedName = await lookupAddress(address, ChainId.Polygon, polygonProvider);
      assert.equal(resolvedName, expectedName);
    });

    it('should not resolve address to name on when given address without reverse record', async () => {
      const address = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C';
      const expectedName = undefined;
      const resolvedName = await lookupAddress(address, ChainId.Polygon, polygonProvider);
      assert.equal(resolvedName, expectedName);
    });

    it('should return undefined when passed invalid address', async () => {
      const address = '0x0';
      const expectedName = undefined;
      const resolvedName = await lookupAddress(address, ChainId.Polygon, polygonProvider);
      assert.equal(resolvedName, expectedName);
    });
  });

  describe('lookupDomain', () => {
    it('should resolve domain to address on polygon', async () => {
      const name = 'wendyzhou.nft';
      const expectedAddress = '0x0C3aCC82348E261056FD9D43817F7cB441bb9CfC';
      const resolvedAddress = await lookupDomain(name, ChainId.Polygon, polygonProvider);
      assert.equal(resolvedAddress, expectedAddress);
    });

    it('should resolve domain to address on ethereum', async () => {
      const name = 'giacomochiarot.crypto';
      const expectedAddress = '0xF40fE06c96Fb6be8cf1995dd039Bb59408656046';
      const resolvedAddress = await lookupDomain(name, ChainId.Ethereum, ethereumProvider);
      assert.equal(resolvedAddress, expectedAddress);
    });

    it('should not resolve name to address on when given name without record', async () => {
      const name = `unlikelytoexist${Date.now()}.nft`;
      const expectedAddress = undefined;
      const resolvedAddress = await lookupDomain(name, ChainId.Polygon, polygonProvider);
      assert.equal(resolvedAddress, expectedAddress);
    });

    it('should return undefined when passed empty domain', async () => {
      const name = '';
      const expectedAddress = undefined;
      const resolvedAddress = await lookupDomain(name, ChainId.Polygon, polygonProvider);
      assert.equal(resolvedAddress, expectedAddress);
    });

    it('should return undefined when passed invalid domain with no tld', async () => {
      const name = 'invalid';
      const expectedAddress = undefined;
      const resolvedAddress = await lookupDomain(name, ChainId.Polygon, polygonProvider);
      assert.equal(resolvedAddress, expectedAddress);
    });

    it('should return undefined when passed invalid domain with unsupported tld', async () => {
      const name = 'eddiez.bnb';
      const expectedAddress = undefined;
      const resolvedAddress = await lookupDomain(name, ChainId.Polygon, polygonProvider);
      assert.equal(resolvedAddress, expectedAddress);
    });
  });
});
