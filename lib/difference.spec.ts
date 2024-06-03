import {
  array,
  arrayDiff,
  arrayDiffLeft,
  arrayDiffRight,
  arrayIntersection,
  object,
  objectDiff,
  objectDiffLeft,
  objectDiffRight,
  objectIntersection,
} from "./difference";

describe("array", () => {
  it("intersection should return common elements", () => {
    const left = [1, 2, "3", 4, 5];
    const right = [2, 3, 4];

    expect(arrayIntersection(left, right)).toEqual([2, 4]);
  });

  it("arrayDiff should return unique elements", () => {
    const left = [1, 2, "3", 4, 5];
    const right = [2, 3, 4];
    
    const [onlyInLeft, onlyInRight] = arrayDiff(left, right);

    expect(onlyInLeft).toEqual([1, "3", 5]);
    expect(onlyInRight).toEqual([3]);
  });

  it("arrayDiffLeft and arrayDiffRight should return corresponding unique elements", () => {
    const left = ["only left", "abc", "1", 1];
    const right = ["only right", "1", 1, "abc"];
    
    const onlyInLeft = arrayDiffLeft(left, right);
    const onlyInRight = arrayDiffRight(left, right);

    expect(onlyInLeft).toEqual(["only left"]);
    expect(onlyInRight).toEqual(["only right"]);
  });

  it("grouped array functions should be the same as the individual functions", () => {
    expect(array.intersection).toEqual(arrayIntersection);
    expect(array.diff).toEqual(arrayDiff);
    expect(array.diffLeft).toEqual(arrayDiffLeft);
    expect(array.diffRight).toEqual(arrayDiffRight);
  });
});

describe("object", () => {
  const left = {
    same: "same key, same value",
    left: "unique key",
    diff: "same key, different value"
  };
  const right = {
    same: "same key, same value",
    right: "unique key",
    diff: "same key but different value"
  };
  it("intersection should return common attributes", () => {
    expect(objectIntersection(left, right)).toEqual({
      same: "same key, same value",
    });
  });

  it("objectDiff should return unique attributes", () => {
    expect(objectDiff(left, right)).toEqual([{
      left: "unique key",
      diff: "same key, different value"
    }, {
      right: "unique key",
      diff: "same key but different value"
    }]);
  });

  it("objectDiffLeft and objectDiffRight should return corresponding unique attributes", () => {
    expect(objectDiffLeft(left, right)).toEqual({
      left: "unique key",
      diff: "same key, different value"
    });
    expect(objectDiffRight(left, right)).toEqual({
      right: "unique key",
      diff: "same key but different value"
    });
  });

  it("grouped object functions should be the same as the individual functions", () => {
    expect(object.intersection).toEqual(objectIntersection);
    expect(object.diff).toEqual(objectDiff);
    expect(object.diffLeft).toEqual(objectDiffLeft);
    expect(object.diffRight).toEqual(objectDiffRight);
  });
});