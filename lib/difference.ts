export const arrayIntersection = (left: any[], right: any[]): any[] =>
  left.filter((value) => right.includes(value));

export const arrayDiff = (
  left: any[],
  right: any[]
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
  right: ObjectDiffArg
): ObjectDiffArg =>
  Object.entries(left).reduce(
    (acc, [key, value]) => {
      if (key in right && right[key] === value) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<any, any>
  );

export const objectDiff = (left: Record<any, any>, right: Record<any, any>) => {
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

export const objectDiffLeft = (
  left: Record<any, any>,
  right: Record<any, any>
) => {
  const [onlyInLeft] = objectDiff(left, right);
  return onlyInLeft;
};

export const objectDiffRight = (
  left: Record<any, any>,
  right: Record<any, any>
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