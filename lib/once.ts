/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Given a task function that returns a promise, this function will cache the original response on first call
 * and future invocations will receive the same cached response.
 * 
 * This means that the task function will be invoked once, and subsequent calls will instantly resolve with the same response.
 * 
 * The cached response is discarded when it rejects, so failed tasks can be retried.
 * 
 * @param task - The task function that returns a promise.
 * @returns A curried function wrapping around the task function. Call this function to execute the task and cache the response.
 */
export const once = <T>(task: (...args: any[]) => Promise<T>) => {
  let cachedResponse: Promise<T> | undefined;

  return (...args: any[]): Promise<T> => {
    if (!cachedResponse) {
      cachedResponse = task(...args).catch((err) => {
        cachedResponse = undefined;
        throw err;
      });
    }

    return cachedResponse;
  };
};

export default once;
