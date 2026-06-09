import { getFulfilledValue } from "./promise";

describe("promise", () => {
  describe("getFulfilledValue", () => {
    it("on resolved promises, should return fulfilled values", async () => {
      const first = async () => Promise.resolve("1");
      const second = async () => Promise.resolve("2");

      const results = await Promise.allSettled([first(), second()]);

      expect(getFulfilledValue(results[0])).toEqual("1");
      expect(getFulfilledValue(results[1])).toEqual("2");
    });

    it("on rejected promises, should return null", async () => {
      const first = async () => Promise.reject("1");
      const second = async () => Promise.reject(new Error("rejected"));

      const results = await Promise.allSettled([first(), second()]);

      expect(getFulfilledValue(results[0])).toBeNull();
      expect(getFulfilledValue(results[1])).toBeNull();
    });

    it("on rejected promises, should call the error handler", async () => {
      const first = async () => Promise.reject("1");

      const errorHandler = vi.fn();

      const results1 = await Promise.allSettled([first()]);

      expect(getFulfilledValue(results1[0], errorHandler)).toBeNull();
      expect(errorHandler).toHaveBeenLastCalledWith("1");

      const err = new Error("rejected");
      const second = async () => Promise.reject(err);
      const results2 = await Promise.allSettled([second()]);

      expect(getFulfilledValue(results2[0], errorHandler)).toBeNull();
      expect(errorHandler).toHaveBeenLastCalledWith(err);
    });

    it("on rejected promises, should use the supplied default value", async () => {
      const first = async () => Promise.reject("1");
      const second = async () => Promise.reject(new Error("2"));

      const errorHandler = vi.fn();

      const results = await Promise.allSettled([first(), second()]);

      expect(
        getFulfilledValue(results[0], errorHandler, "default value"),
      ).toEqual("default value");
      expect(getFulfilledValue(results[1], undefined, "default value")).toEqual(
        "default value",
      );
      expect(errorHandler).toHaveBeenCalledWith("1");
    });
  });
});
