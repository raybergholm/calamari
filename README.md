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
