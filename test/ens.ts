import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '../src/chains.js';
import { lookupAddress, lookupDomain } from '../src/resolvers/ens.js';
import * as assert from 'node:assert';

describe('ENS', () => {
  const provider = new JsonRpcProvider('https://rpc.ankr.com/eth', ChainId.Ethereum);

  describe('lookupAddress', () => {
    it('should resolve address to name on ethereum mainnet', async () => {
      const address = '0xfFD1Ac3e8818AdCbe5C597ea076E8D3210B45df5';
      const expectedName = 'makoto.eth';
      const resolvedName = await lookupAddress(address, ChainId.Ethereum, provider);
      assert.equal(resolvedName, expectedName);
    });

    it('should not resolve address to name on when given address without reverse record', async () => {
      const address = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C';
      const expectedName = undefined;
      const resolvedName = await lookupAddress(address, ChainId.Ethereum, provider);
      assert.equal(resolvedName, expectedName);
    });

    it('should return undefined when passed invalid address', async () => {
      const address = '0x0';
      const expectedName = undefined;
      const resolvedName = await lookupAddress(address, ChainId.Ethereum, provider);
      assert.equal(resolvedName, expectedName);
    });
  });

  describe('lookupDomain', () => {
    it('should resolve domain to address on ethereum mainnet', async () => {
      const name = 'makoto.eth';
      const expectedAddress = '0xfFD1Ac3e8818AdCbe5C597ea076E8D3210B45df5';
      const resolvedAddress = await lookupDomain(name, ChainId.Ethereum, provider);
      assert.equal(resolvedAddress, expectedAddress);
    });

    it('should not resolve name to address on when given name without record', async () => {
      const name = `unlikelytoexist${Date.now()}.eth`;
      const expectedAddress = undefined;
      const resolvedAddress = await lookupDomain(name, ChainId.Ethereum, provider);
      assert.equal(resolvedAddress, expectedAddress);
    });

    it('should return undefined when passed empty domain', async () => {
      const name = '';
      const expectedAddress = undefined;
      const resolvedAddress = await lookupDomain(name, ChainId.Ethereum, provider);
      assert.equal(resolvedAddress, expectedAddress);
    });

    it('should return undefined when passed invalid domain with no tld', async () => {
      const name = 'invalid';
      const expectedAddress = undefined;
      const resolvedAddress = await lookupDomain(name, ChainId.Ethereum, provider);
      assert.equal(resolvedAddress, expectedAddress);
    });

    it('should return undefined when passed invalid domain with unsupported tld', async () => {
      const name = 'eddiez.bnb';
      const expectedAddress = undefined;
      const resolvedAddress = await lookupDomain(name, ChainId.Ethereum, provider);
      assert.equal(resolvedAddress, expectedAddress);
    });
  });
});
