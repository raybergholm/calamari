import { chunk } from "./chunk";

describe("chunk", () => {
  it("should throw an error if chunkSize is less than or equal to 0", () => {
    expect(() => chunk([], 0)).toThrow();
    expect(() => chunk([], -1)).toThrow();
  });

  it("should return an empty array if the input array is empty", () => {
    expect(chunk([], 10)).toEqual([[]]);
  });

  it("should return a correctly chunked array if the input array is empty", () => {
    expect(chunk<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10],
    ]);
  });
});
