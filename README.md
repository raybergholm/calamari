# calamari

A collection of util and helper functions with the minimum amount of dependencies.

## [chunk](./lib/chunk.ts)

Splits an array into chunks of a given size. If the array can't be split evenly, the last chunk will be of a different size.

```typescript
import { chunk } from "calamari";

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const chunks = chunk<number>(arr, 3);
// will be split into [[1, 2, 3] [4, 5, 6] [7, 8, 9], [10]]
```

## [difference](./lib/difference.ts)

Calculates the intersection and differences between two arrays or two objects.

### Arrays

The array functions use `.includes` to determine intersection and difference.

#### arrayIntersection

```typescript
import { arrayIntersection } from "calamari";

const left = [1, 2, 3];
const right: [3, 4, 5];

const result = arrayIntersection(left, right);
// result will be [3]
```

#### arrayDiff

Returns elements unique to each argument in tuple format:

```typescript
import { arrayDiff } from "calamari";

const left = [1, 2, 3];
const right: [3, 4, 5];

const result = arrayDiff(left, right);
// result will be [[1, 2], [4, 5]]
```

#### arrayDiffLeft

The same as `arrayDiff`, returns only elements found in the first (left) argument:

```typescript
import { arrayDiffLeft } from "calamari";

const left = [1, 2, 3];
const right: [3, 4, 5];

const result = arrayDiffLeft(left, right);
// result will be [1, 2]
```

#### arrayDiffRight

The same as `arrayDiff`, returns only elements found in the second (right) argument:

```typescript
import { arrayDiffRight } from "calamari";

const left = [1, 2, 3];
const right: [3, 4, 5];

const result = arrayDiffRight(left, right);
// result will be [4, 5]
```

These functions are also exported as a group if treeshaking isn't necessary:

```typescript
import { array } from "calamari";

const {
  intersection,
  diff,
  diffLeft,
  diffRight
} = array;
```

### Objects

The object functions pick attributes that are common to both objects being compared and define equality where both key and value match using the === operator

#### objectIntersection

```typescript
import { objectIntersection } from "calamari";

const left = {
  common: "toBoth",
  diff: "onlyLeft",
  something: "else"
};
const right = {
  common: "toBoth",
  diff: "onlyRight",
  something: "else entirely"
};

const result = objectIntersection(left, right);
// result will be { common: "toBoth" }
```

#### objectDiff

```typescript
import { objectDiff } from "calamari";

const left = {
  common: "toBoth",
  diff: "onlyLeft",
  something: "else"
};
const right = {
  common: "toBoth",
  diff: "onlyRight",
  something: "else entirely"
};

const result = objectIntersection(left, right);
// result will be [{ diff: "onlyLeft", something: "else" }, { diff: "onlyRight", something: "else entirely" }]
```

#### objectDiffLeft

The same as `objectDiff`, returns only attributes found in the first (left) argument:

```typescript
import { objectDiffLeft } from "calamari";

const left = {
  common: "toBoth",
  diff: "onlyLeft",
  something: "else"
};
const right = {
  common: "toBoth",
  diff: "onlyRight",
  something: "else entirely"
};

const result = objectDiffLeft(left, right);
// result will be { diff: "onlyLeft", something: "else" }
```

#### objectDiffRight

The same as `objectDiff`, returns only attributes found in the second (right) argument:

```typescript
import { objectDiffRight } from "calamari";

const left = {
  common: "toBoth",
  diff: "onlyLeft",
  something: "else"
};
const right = {
  common: "toBoth",
  diff: "onlyRight",
  something: "else entirely"
};

const result = objectDiffRight(left, right);
// result will be { diff: "onlyRight", something: "else entirely" }
```

These functions are also exported as a group if treeshaking isn't necessary:

```typescript
import { object } from "calamari";

const {
  intersection,
  diff,
  diffLeft,
  diffRight
} = object;
```

## [once](./lib/once.ts)

Given a task function that returns a promise, this function will cache the original promise on first call, and future invocations will receive the same cached promise. This means that the task function will be invoked once, and subsequent calls will instantly resolve with the same promise.

The cached promise is discarded when it rejects, so failed tasks can be retried.

```typescript
import { once } from "calamari";

const task = () => fetch("https://www.example.com/api/12345");

const wrapped = once(task); // wrap your task with once()

const firstResponse = await wrapped(); // call the wrapper to invoke the task

// ...

const secondResponse = await wrapped();

// firstResponse and secondResponse are the same, fetch will only be called once here
```

You can also pass in args to your wrapped function:

```typescript
import { once } from "calamari";

const wrapped = once(fetch));

const response = await wrapped("https://www.example.com/api/12345");
```
