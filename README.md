# ens-reverse

Minimal repo to reverse address to ENS domains.

## Services supported

| Service                                                | Support             |
|--------------------------------------------------------|---------------------|
| [ENS](https://ens.domains/)                            | Ethereum            |
| [Space ID](https://space.id/)                          | BNB Chain, Arbitrum |
| [Unstoppable Domains](https://unstoppabledomains.com/) | Ethereum, Polygon   |

## Usage

```ts
function lookupAddress(address: string, providers: Partial<Record<ChainId, Provider>>, options?: Options): Promise<string[] | undefined>;
```

```ts
import { lookupAddress, ChainId } from 'ens-reverse';

const providers = {
  [ChainId.Ethereum]: new JsonRpcProvider('https://rpc.ankr.com/eth', ChainId.Ethereum),
  [ChainId.BNB]: new JsonRpcProvider('https://rpc.ankr.com/bsc', ChainId.BNB),
  [ChainId.Polygon]: new JsonRpcProvider('https://rpc.ankr.com/polygon', ChainId.Polygon),
  [ChainId.Arbitrum]: new JsonRpcProvider('https://rpc.ankr.com/arbitrum', ChainId.Arbitrum),
};

await lookupAddress('0xfFD1Ac3e8818AdCbe5C597ea076E8D3210B45df5', providers); // ['makoto.eth']
await lookupAddress('0x0e76a6dC9af8080b48C51E564e964CD15b9D6664', providers); // ['eddiez.bnb']
await lookupAddress('0x0C3aCC82348E261056FD9D43817F7cB441bb9CfC', providers); // ['wendyzhou.nft']
```

## Dependencies

`@ethersproject/abstract-provider`, `@ethersproject/contracts`, `@ethersproject/hash` and `@ethersproject/address` are required peer dependencies.
