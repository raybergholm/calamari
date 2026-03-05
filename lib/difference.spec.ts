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
  type ObjectDiff = Record<string, string | number | boolean | null | undefined>;
  const left: ObjectDiff = {
    sameString: "same key, same value",
    sameNumber: 3,
    sameNull: null,
    sameUndefined: undefined,
    leftString: "unique key in left",
    leftNumber: 99,
    diffString: "same key, different value",
    diffNumber: 100,
    diffBoolean: true,
    diffNull: null,
    diffUndefined: null,
  };
  const right: ObjectDiff = {
    sameString: "same key, same value",
    sameNumber: 3,
    sameNull: null,
    sameUndefined: undefined,
    rightString: "unique key in right",
    rightBoolean: false,
    rightNull: null,
    rightUndefined: undefined,
    diffString: "same key but different value",
    diffNumber: 200,
    diffBoolean: false,
    diffNull: "",
    diffUndefined: undefined,
  };

  it("intersection should return common attributes", () => {
    expect(objectIntersection(left, right)).toEqual({
      sameString: "same key, same value",
      sameNumber: 3,
      sameNull: null,
      sameUndefined: undefined,
    });
  });

  it("objectDiff should return unique attributes", () => {
    const [onlyInLeft, onlyInRight] = objectDiff<ObjectDiff>(left, right);

    expect(onlyInLeft).toEqual({
      leftString: "unique key in left",
      leftNumber: 99,
      diffString: "same key, different value",
      diffNumber: 100,
      diffBoolean: true,
      diffNull: null,
      diffUndefined: null,
    });
    expect(onlyInRight).toEqual({
      rightString: "unique key in right",
      rightBoolean: false,
      rightNull: null,
      rightUndefined: undefined,
      diffString: "same key but different value",
      diffNumber: 200,
      diffBoolean: false,
      diffNull: "",
      diffUndefined: undefined,
    });
  });

  it("objectDiffLeft and objectDiffRight should return corresponding unique attributes", () => {
    const onlyInLeft = objectDiffLeft(left, right);
    expect(onlyInLeft).toEqual({
      leftString: "unique key in left",
      leftNumber: 99,
      diffString: "same key, different value",
      diffNumber: 100,
      diffBoolean: true,
      diffNull: null,
      diffUndefined: null,
    });

    const onlyInRight = objectDiffRight(left, right);
    expect(onlyInRight).toEqual({
      rightString: "unique key in right",
      rightBoolean: false,
      rightNull: null,
      rightUndefined: undefined,
      diffString: "same key but different value",
      diffNumber: 200,
      diffBoolean: false,
      diffNull: "",
      diffUndefined: undefined,
    });
  });

  it("grouped object functions should be the same as the individual functions", () => {
    expect(object.intersection).toEqual(objectIntersection);
    expect(object.diff).toEqual(objectDiff);
    expect(object.diffLeft).toEqual(objectDiffLeft);
    expect(object.diffRight).toEqual(objectDiffRight);
  });
});
