export const arrayIntersection = (left: any[], right: any[]): any[] =>
  left.filter((value) => right.includes(value));

export const arrayDiff = (
  left: any[],
  right: any[],
): [any[], any[], intersection: any[]] => {
  const intersection = arrayIntersection(left, right);
  const onlyInLeft = left.filter((value) => !intersection.includes(value));
  const onlyInRight = right.filter((value) => !intersection.includes(value));

  return [onlyInLeft, onlyInRight, intersection];
};

export const arrayDiffLeft = (left: any[], right: any[]): any[] => {
  const [onlyInLeft] = arrayDiff(left, right);
  return onlyInLeft;
};

export const arrayDiffRight = (left: any[], right: any[]): any[] => {
  const [, onlyInRight] = arrayDiff(left, right);
  return onlyInRight;
};

export const array = {
  intersection: arrayIntersection,
  diff: arrayDiff,
  diffLeft: arrayDiffLeft,
  diffRight: arrayDiffRight,
};

export type ObjectDiffArg = Record<string | number | symbol, any>;

export const objectIntersection = (
  left: ObjectDiffArg,
  right: ObjectDiffArg,
): ObjectDiffArg =>
  Object.entries(left).reduce(
    (acc, [key, value]) => {
      if (key in right && right[key] === value) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<any, any>,
  );

// Compare two objects, returns all props which are not in the other object, or where the value is different.
// Works only with primitives (string, number, boolean) which can be compared with !==, don't use this for nested objects or arrays
export const objectDiff = <
  T extends Record<string, string | number | boolean | null | undefined>,
>(
  left: T,
  right: T,
): [T, T] => {
  const onlyInLeft = Object.entries(left)
    .filter(([key, value]) => !(key in right) || right[key] !== value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as T);

  const onlyInRight = Object.entries(right)
    .filter(([key, value]) => !(key in left) || left[key] !== value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as T);

  return [onlyInLeft, onlyInRight];
};

export const objectDiffLeft = (
  left: Record<any, any>,
  right: Record<any, any>,
) => {
  const [onlyInLeft] = objectDiff(left, right);
  return onlyInLeft;
};

export const objectDiffRight = (
  left: Record<any, any>,
  right: Record<any, any>,
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
