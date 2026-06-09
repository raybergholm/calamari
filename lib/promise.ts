/**
 * Helper function to extract the fulfilled value from a PromiseSettledResult. If the promise was rejected, it logs the error and returns a default value or null.
 * @param result - The result of a settled promise, which can be either fulfilled or rejected.
 * @param onError - An optional error handler function that will be called with the rejection reason if the promise was rejected.
 * @param defaultValue - An optional default value to return if the promise was rejected. If not provided, the function will return null in case of rejection.
 * @returns The fulfilled value if the promise was fulfilled, or the default value/null if it was rejected.
 */
export function getFulfilledValue<T>(
  result: PromiseSettledResult<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (reason: any) => void | undefined,
  defaultValue?: T,
): T | null {
  if (result.status === "fulfilled") {
    return result.value;
  } else {
    if (onError) {
      onError(result.reason);
    }
    return defaultValue ?? null;
  }
}
