export type WaitIntervalsInMs = number | [number, ...number[]];
export type BackoffConfig = {
  attempts: number;
  waitIntervalsInMs: WaitIntervalsInMs;
};

export const DEFAULT_BACKOFF_CONFIG: BackoffConfig = {
  attempts: 3,
  waitIntervalsInMs: 0,
};

/**
 * Given a task function that returns a promise, this function adds retry logic and attempts to retry failures based on the given config.
 * @param task - The task function that returns a promise.
 * @param config - The backoff configuration specifying the number of attempts and wait intervals.
 * @returns A curried function wrapping around the task function. Call this function to execute the task.
 */
export const retry = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  task: (...args: any[]) => Promise<T>,
  config: BackoffConfig = DEFAULT_BACKOFF_CONFIG,
) => {
  const sleep = (ms: number = 0) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  if (
    Array.isArray(config.waitIntervalsInMs) &&
    config.waitIntervalsInMs.length < config.attempts
  ) {
    throw new Error(
      "fewer waitIntervalsInMs values than attempts, check your config",
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (...args: any[]): Promise<T> => {
    let attempt = 0;
    const waitIntervals = Array.isArray(config.waitIntervalsInMs)
      ? config.waitIntervalsInMs
      : Array(config.attempts).fill(config.waitIntervalsInMs);

    while (attempt < config.attempts) {
      try {
        return await task(...args);
      } catch (err) {
        if (attempt >= config.attempts) {
          throw err;
        }
        attempt++;
        await sleep(waitIntervals[attempt]);
      }
    }
    throw Error("no");
  };
};

export default retry;
