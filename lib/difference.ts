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

export const arrayDiffLeft = <T>(left: T[], right: T[]): T[] => {
  const [onlyInLeft] = arrayDiff(left, right);
  return onlyInLeft;
};

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

export const objectDiff = <T>(
  left: ObjectDiffArg<T>,
  right: ObjectDiffArg<T>,
) => {
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

export const objectDiffLeft = <T>(
  left: ObjectDiffArg<T>,
  right: ObjectDiffArg<T>,
) => {
  const [onlyInLeft] = objectDiff(left, right);
  return onlyInLeft;
};

export const objectDiffRight = <T>(
  left: ObjectDiffArg<T>,
  right: ObjectDiffArg<T>,
) => {
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
