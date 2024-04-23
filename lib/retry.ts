export type WaitIntervalsInMs = number | [number, ...number[]];
export type BackoffConfig = {
  attempts: number;
  waitIntervalsInMs: WaitIntervalsInMs;
};

export const DEFAULT_BACKOFF_CONFIG: BackoffConfig = {
  attempts: 3,
  waitIntervalsInMs: 0,
};

export const retry = <T>(
  task: (...args: any[]) => Promise<T>,
  config: BackoffConfig = DEFAULT_BACKOFF_CONFIG
) => {
  const sleep = (ms: number = 0) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  if (
    Array.isArray(config.waitIntervalsInMs) &&
    config.waitIntervalsInMs.length < config.attempts
  ) {
    throw new Error(
      "fewer waitIntervalsInMs values than attempts, check your config"
    );
  }

  return async (...args: any[]): Promise<T> => {
    let attempt = 0;
    const waitIntervals = Array.isArray(config.waitIntervalsInMs)
      ? config.waitIntervalsInMs
      : Array(config.attempts).fill(config.waitIntervalsInMs);

    while (attempt < config.attempts) {
      try {
        return task(...args);
      } catch (err) {
        if (attempt >= config.attempts) {
          throw err;
        }
        await sleep(waitIntervals[attempt]);
      }
    }
    throw Error("no");
  };
};

export default retry;
