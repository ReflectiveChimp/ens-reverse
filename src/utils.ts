import { getAddress } from '@ethersproject/address';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function isFulfilledResult<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function normalizeAddress(address: unknown): string | undefined {
  if (typeof address === 'string' && address.length === 42) {
    try {
      return getAddress(address.toLowerCase());
    } catch {
      return undefined;
    }
  }

  return undefined;
}
