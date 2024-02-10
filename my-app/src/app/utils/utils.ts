export function getRandomIndex<T>(array: T[]): number {
    if (array.length === 0) {
      throw new Error('Array is empty');
    }
    return Math.floor(Math.random() * array.length);
  }