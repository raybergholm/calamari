import { retry, type RetryConfig, DEFAULT_RETRY_CONFIG } from "./retry";

describe("retry", () => {
  const mockTask = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should not trigger extra calls on success", async () => {
    mockTask.mockResolvedValue("OUTPUT");

    const retryable = retry(mockTask);

    await expect(retryable()).resolves.toEqual("OUTPUT");
    expect(mockTask).toHaveBeenCalledTimes(1);
  });

  it("should support args for the task function", async () => {
    mockTask.mockImplementation((first, second, third) =>
      Promise.resolve(first + second + third),
    );
    const retryable = retry(mockTask);
    await expect(retryable(1, 2, 3)).resolves.toEqual(6);
  });

  it("should keep trying until task succeeds", async () => {
    mockTask
      .mockRejectedValueOnce(new Error("NO"))
      .mockResolvedValueOnce("YES");

    const retryable = retry(mockTask);

    await expect(retryable()).resolves.toEqual("YES");
    expect(mockTask).toHaveBeenCalledTimes(2);
  });

  it("should keep trying until max attempts if the task keeps failing", async () => {
    mockTask.mockRejectedValue(new Error("WILL ALWAYS REJECT"));

    const retryable = retry(mockTask);

    await expect(async () => await retryable()).rejects.toThrow();
    expect(mockTask).toHaveBeenCalledTimes(DEFAULT_RETRY_CONFIG.attempts);
  });

  describe("should support custom retryConfig", () => {
    it("waitIntervalsInMs as number", async () => {
      mockTask.mockRejectedValue(new Error("WILL ALWAYS REJECT"));

      const customConfig: RetryConfig = {
        attempts: 5,
        waitIntervalsInMs: 0,
      };

      const retryable = retry(mockTask, customConfig);

      await expect(retryable()).rejects.toThrow();
      expect(mockTask).toHaveBeenCalledTimes(customConfig.attempts);
    });

    it("waitIntervalsInMs as a number array", async () => {
      mockTask.mockRejectedValue(new Error("WILL ALWAYS REJECT"));

      const customConfig: RetryConfig = {
        attempts: 5,
        waitIntervalsInMs: [1, 2, 3, 4, 5],
      };

      const retryable = retry(mockTask, customConfig);

      await expect(async () => await retryable()).rejects.toThrow();
      expect(mockTask).toHaveBeenCalledTimes(customConfig.attempts);
    });

    it("waitIntervalsInMs as a short number array should be filled up to the attempts count", async () => {
      mockTask.mockRejectedValue(new Error("WILL ALWAYS REJECT"));

      const customConfig: RetryConfig = {
        attempts: 10,
        waitIntervalsInMs: [0, 1],
      };

      const retryable = retry(mockTask, customConfig);

      await expect(async () => await retryable()).rejects.toThrow();
      expect(mockTask).toHaveBeenCalledTimes(customConfig.attempts);
    });
  });
});
