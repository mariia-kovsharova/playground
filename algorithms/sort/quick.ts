import assert from 'assert';
import { isEqual } from 'lodash';

/**
 * O(n * log(n))
 * @param array массив элементов для сортировки
 */
const quick = <T>(array: Array<T>): Array<T> => {
    // базовый случай - когда массив имеет длину 0 или 1, он отсортирован
    if (array.length <= 1) {
        return array;
    }

    const middleIndex = Math.floor(array.length / 2);
    const middleElement = array[middleIndex];

    const less = array.filter((i: T) => i < middleElement);
    const greather = array.filter((i: T) => i > middleElement);

    return [...quick(less), middleElement, ...quick(greather)];
};

const arr1 = [20, 12, 3, 53, 13, 1, 14, 8, 2, 19];
const arr2 = ['test', 'cat', 'do', 'abc', 'a', 'dod', 'ab', 'tst'];

const sortedArr1 = [1, 2, 3, 8, 12, 13, 14, 19, 20, 53];
const sortedArr2 = ['a', 'ab', 'abc', 'cat', 'do', 'dod', 'test', 'tst'];

assert(isEqual(quick(arr1), sortedArr1));
assert(isEqual(quick(arr2), sortedArr2));

console.log('done');

export { };
