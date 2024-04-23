import { once } from "./once";

describe("once", () => {
  const mockTask = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return an async function that resolves with the same value as the input task's return value", async () => {
    mockTask.mockResolvedValue("OUTPUT");
    const cached = once(mockTask);
    await expect(cached()).resolves.toEqual("OUTPUT");
  });

  it("should support args for the task function", async () => {
    mockTask.mockImplementation((first, second, third) => Promise.resolve(first + second + third));
    const cached = once(mockTask);
    await expect(cached(1, 2, 3)).resolves.toEqual(6);
  });

  it("should only call input task once if it's successful", async () => {
    mockTask.mockImplementation(
      () =>
        new Promise((res) => {
          setTimeout(() => {
            res("OUTPUT");
          }, 100);
        })
    );

    const cached = once(mockTask);
    await cached();
    await cached();
    await cached();
    await cached();
    await cached();
    await expect(cached()).resolves.toEqual("OUTPUT");
    expect(mockTask).toHaveBeenCalledTimes(1);
  });

  it("should not cache the input if it rejects", async () => {
    mockTask.mockRejectedValue(new Error("NOPE"));

    const cached = once(mockTask);

    // Wait until the first call rejects
    await expect(cached()).rejects.toThrow();

    // Trigger a new call
    await cached().catch(() => {});

    // Expect the input task to be invoked every time
    expect(mockTask).toHaveBeenCalledTimes(2);
  });
});
