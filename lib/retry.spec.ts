import { retry, BackoffConfig, DEFAULT_BACKOFF_CONFIG } from "./retry";

describe.skip("retry", () => {
  const mockTask = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should not trigger extra calls on success", async () => {
    mockTask.mockResolvedValue("OUTPUT");

    const retryable = retry(mockTask);

    await expect(retryable()).resolves.toEqual("OUTPUT");
    expect(mockTask).toHaveBeenCalledTimes(1);
  });

  it("should support args for the task function", async () => {
    mockTask.mockImplementation((first, second, third) =>
      Promise.resolve(first + second + third)
    );
    const retryable = retry(mockTask);
    await expect(retryable(1, 2, 3)).resolves.toEqual(6);
  });

  it.skip("should keep trying until task succeeds", async () => {
    mockTask.mockRejectedValueOnce(new Error("NO"));
    mockTask.mockResolvedValueOnce("YES");

    const retryable = retry(mockTask);

    retryable()
      .then((value) => expect(value).toEqual("YES"))
      .catch((err) => console.log(err));
    expect(mockTask).toHaveBeenCalledTimes(2);
  });

  it.skip("should keep trying until max attempts if the task keeps failing", async () => {
    mockTask.mockRejectedValue(new Error("WILL ALWAYS REJECT"));

    const retryable = retry(mockTask);

    await expect(async () => await retryable()).rejects.toThrow();
    expect(mockTask).toHaveBeenCalledTimes(DEFAULT_BACKOFF_CONFIG.attempts);
  });

  it.skip("should support custom backoffConfig", async () => {
    mockTask.mockRejectedValue(new Error("WILL ALWAYS REJECT"));

    const customConfig: BackoffConfig = {
      attempts: 5,
      waitIntervalsInMs: 0,
    };

    const retryable = retry(mockTask, customConfig);

    await expect(retryable()).rejects.toThrow();
    expect(mockTask).toHaveBeenCalledTimes(customConfig.attempts);
  });

  it.skip("should support custom backoffConfig using an array of intervals", async () => {
    mockTask.mockRejectedValue(new Error("WILL ALWAYS REJECT"));

    const customConfig: BackoffConfig = {
      attempts: 5,
      waitIntervalsInMs: [1, 2, 3, 4, 5],
    };

    const retryable = retry(mockTask, customConfig);

    await expect(async () => await retryable()).rejects.toThrow();
    expect(mockTask).toHaveBeenCalledTimes(customConfig.attempts);
  });

  it("should throw if custom backoffConfig is malformed", async () => {
    mockTask.mockRejectedValue(new Error("WILL ALWAYS REJECT"));

    const customConfig: BackoffConfig = {
      attempts: 3,
      waitIntervalsInMs: [0],
    };

    expect(() => retry(mockTask, customConfig)).toThrow(
      "fewer waitIntervalsInMs values than attempts, check your config"
    );
    expect(mockTask).toHaveBeenCalledTimes(0);
  });
});
