export type RetryConfig = {
  attempts: number;
  waitIntervalsInMs: number | number[];
};

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
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
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
) => {
  const sleep = (ms: number = 0) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const formatWaitIntervals = (config: RetryConfig): number[] => {
    if (!Array.isArray(config.waitIntervalsInMs)) {
      // waitIntervalsInMs is a single number
      return Array(config.attempts).fill(config.waitIntervalsInMs);
    }

    if (config.waitIntervalsInMs.length >= config.attempts) {
      // waitIntervalsInMs is an array and of sufficient length
      return config.waitIntervalsInMs;
    }

    // waitIntervalsInMs is an array but shorter than attempts, fill the rest with the last value
    return config.waitIntervalsInMs.concat(
      Array(config.attempts - config.waitIntervalsInMs.length).fill(
        config.waitIntervalsInMs[config.waitIntervalsInMs.length - 1],
      ),
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (...args: any[]): Promise<T> => {
    let attempt = 0;
    const waitIntervals = formatWaitIntervals(config);

    while (attempt < config.attempts) {
      try {
        return await task(...args);
      } catch (err) {
        if (attempt >= config.attempts) {
          throw err;
        }
        attempt++;
        if (waitIntervals[attempt]) {
          await sleep(waitIntervals[attempt]);
        }
      }
    }
    throw Error("no");
  };
};

export default retry;
