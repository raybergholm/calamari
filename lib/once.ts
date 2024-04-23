/* 
  Given a task function that returns a promise, this function will cache the original promise on first call
  and future invocations will receive the same cached promise.

  This means that the task function will be invoked once, and subsequent calls will instantly resolve with the same promise.

  The cached promise is discarded when it rejects, so failed tasks can be retried.
*/

export const once = <T>(task: (...args: any[]) => Promise<T>) => {
  let cachedResponse: Promise<T> | undefined;

  return (...args: any[]): Promise<T> => {
    if (!cachedResponse) {
      cachedResponse = task(...args).catch((err) => {
        cachedResponse = undefined;
        throw err;
      })
    }

    return cachedResponse;
  }
};

export default once;
