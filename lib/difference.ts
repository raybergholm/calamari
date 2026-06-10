/**
 * Find the items that exist in both input arrays
 * @param left - The first array.
 * @param right - The second array.
 * @returns A new array containing the intersecting items.
 */
export const arrayIntersection = <T>(left: T[], right: T[]): T[] =>
  left.filter((value) => right.includes(value));

export const arrayDiff = <T>(
  left: T[],
  right: T[],
): [T[], T[], intersection: T[]] => {
  const intersection = arrayIntersection(left, right);
  const onlyInLeft = left.filter((value) => !intersection.includes(value));
  const onlyInRight = right.filter((value) => !intersection.includes(value));

  return [onlyInLeft, onlyInRight, intersection];
};

/**
 * Find the items unique to the left array
 * @param left - The first array.
 * @param right - The second array.
 * @returns A new array containing the items unique to the left array.
 */
export const arrayDiffLeft = <T>(left: T[], right: T[]): T[] => {
  const [onlyInLeft] = arrayDiff(left, right);
  return onlyInLeft;
};

/**
 * Find the items unique to the right array
 * @param left - The first array.
 * @param right - The second array.
 * @returns A new array containing the items unique to the right array.
 */
export const arrayDiffRight = <T>(left: T[], right: T[]): T[] => {
  const [, onlyInRight] = arrayDiff(left, right);
  return onlyInRight;
};

export const array = {
  intersection: arrayIntersection,
  diff: arrayDiff,
  diffLeft: arrayDiffLeft,
  diffRight: arrayDiffRight,
};

export type ObjectDiffArg<T> = Record<string | number | symbol, T>;

/**
 * Find the key-value pairs that exist in both input objects and have the same value.
 * @param left - The first object.
 * @param right - The second object.
 * @returns A new object containing the intersecting key-value pairs.
 */
export const objectIntersection = <T>(
  left: ObjectDiffArg<T>,
  right: ObjectDiffArg<T>,
): ObjectDiffArg<T> =>
  Object.entries(left).reduce((acc, [key, value]) => {
    if (key in right && right[key] === value) {
      acc[key] = value;
    }
    return acc;
  }, {} as ObjectDiffArg<T>);

/**
 * Find the key-value pairs that differ (either key only exists in one object or values are different) between the left and right objects.
 * @param left - The first object.
 * @param right - The second object.
 * @returns A tuple containing two objects with the differing key-value pairs.
 */
export const objectDiff = <T>(
  left: ObjectDiffArg<T>,
  right: ObjectDiffArg<T>,
): [ObjectDiffArg<T>, ObjectDiffArg<T>] => {
  const intersectionKeys = Object.keys(objectIntersection(left, right));
  return [
    Object.keys(left)
      .filter((key) => !intersectionKeys.includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: left[key] }), {}),
    Object.keys(right)
      .filter((key) => !intersectionKeys.includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: right[key] }), {}),
  ];
};

/**
 * Find the key-value pairs that differ (either key only exists in one object or values are different) between the left and right objects.
 * 
 * Use this if you only care about the left object.
 * @param left - The first object.
 * @param right - The second object.
 * @returns A new object containing the key-value pairs unique to the left object.
 */
export const objectDiffLeft = <T>(
  left: ObjectDiffArg<T>,
  right: ObjectDiffArg<T>,
): ObjectDiffArg<T> => {
  const [onlyInLeft] = objectDiff(left, right);
  return onlyInLeft;
};

/**
 * Find the key-value pairs that differ (either key only exists in one object or values are different) between the left and right objects.
 * 
 * Use this if you only care about the right object.
 * @param left - The first object.
 * @param right - The second object.
 * @returns A new object containing the key-value pairs unique to the right object.
 */
export const objectDiffRight = <T>(
  left: ObjectDiffArg<T>,
  right: ObjectDiffArg<T>,
): ObjectDiffArg<T> => {
  const [, onlyInRight] = objectDiff(left, right);
  return onlyInRight;
};

export const object = {
  intersection: objectIntersection,
  diff: objectDiff,
  diffLeft: objectDiffLeft,
  diffRight: objectDiffRight,
};

export default {
  array,
  object,
};
