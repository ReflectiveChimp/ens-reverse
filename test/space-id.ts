import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId } from '../src/chains.js';
import { fetchResolverAddress, lookupAddress, lookupDomain } from '../src/resolvers/space-id.js';
import { namehash } from '@ethersproject/hash';
import assert from 'node:assert';

describe('Space ID', () => {
  const provider = new JsonRpcProvider('https://rpc.ankr.com/bsc', ChainId.BNB);

  describe('fetchResolverAddress', () => {
    it('should return correct resolver address for domain', async () => {
      const domainHash = namehash('eddiez.bnb');
      const expectedResolverAddress = '0x7A18768EdB2619e73c4d5067B90Fd84a71993C1D';
      const resolverAddress = await fetchResolverAddress(domainHash, ChainId.BNB, provider);
      assert.equal(resolverAddress, expectedResolverAddress);
    });
  });

  describe('lookupDomain', () => {
    it('should correctly resolve domain to address', async () => {
      const domain = 'eddiez.bnb';
      const expectedAddress = '0x0e76a6dC9af8080b48C51E564e964CD15b9D6664';
      const resolvedAddress = await lookupDomain(domain, ChainId.BNB, provider);
      assert.equal(resolvedAddress, expectedAddress);
    });
  });

  describe('lookupAddress', () => {
    it('should correctly resolve address to domain (confirm: on)', async () => {
      const address = '0x0e76a6dC9af8080b48C51E564e964CD15b9D6664';
      const expectedDomain = 'eddiez.bnb';
      const resolvedDomain = await lookupAddress(address, ChainId.BNB, provider, true);
      assert.equal(resolvedDomain, expectedDomain);
    });

    it('should correctly resolve address to domain (confirm: off)', async () => {
      const address = '0x0e76a6dC9af8080b48C51E564e964CD15b9D6664';
      const expectedDomain = 'eddiez.bnb';
      const resolvedDomain = await lookupAddress(address, ChainId.BNB, provider, false);
      assert.equal(resolvedDomain, expectedDomain);
    });
  });
});
