/**
 * Split an array into smaller arrays of a specified size. If the chunk size is less than or equal to 0, it throws an error.
 * @param array - The array to be chunked.
 * @param chunkSize - The size of each chunk.
 * @returns An array of arrays, where each inner array is a chunk of the original array.
 */
export const chunk = <T>(array: T[], chunkSize: number): T[][] => {
  if (chunkSize <= 0) {
    throw new Error("chunkSize must be greater than 0");
  }

  if (array.length < chunkSize) {
    return [array];
  }

  return array.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(item);
    return acc;
  }, [] as T[][]);
};

export default chunk;
