export function isFulfilledResult<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
