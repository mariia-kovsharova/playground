import assert from 'assert';
import { isEqual } from 'lodash';

/**
 * Слиеяние
 * @param left левый массив для слияния
 * @param right правый массив для слияния
 */
const merge = <T>(left: Array<T>, right: Array<T>): Array<T> => {
    const result = <Array<T>>[];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i += 1;
        } else {
            result.push(right[j]);
            j += 1;
        }
    }

    return result.concat(left.slice(i), right.slice(j));
}

/**
 * O(n * log(n))
 * @param array массив элементов для сортировки
 */
const merge_sort = <T>(array: Array<T>): Array<T> => {
    // базовый случай - когда массив имеет длину 0 или 1, он отсортирован
    if (array.length <= 1) {
        return array;
    }

    const middleIndex = Math.floor(array.length / 2);

    const left = merge_sort(array.slice(0, middleIndex));
    const right = merge_sort(array.slice(middleIndex));

    return merge(left, right);
};

const arr1 = [20, 12, 3, 53, 2, 13, 1, 14, 3, 8, 2, 19];
const arr2 = ['test', 'cat', 'do', 'abc', 'a', 'dod', 'ab', 'tst'];

const sortedArr1 = [1, 2, 2, 3, 3, 8, 12, 13, 14, 19, 20, 53];
const sortedArr2 = ['a', 'ab', 'abc', 'cat', 'do', 'dod', 'test', 'tst'];

assert(isEqual(merge_sort(arr1), sortedArr1));
assert(isEqual(merge_sort(arr2), sortedArr2));

console.log('done');

export { };
