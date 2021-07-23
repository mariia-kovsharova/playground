import assert from 'assert';
import { isEqual } from 'lodash';

/**
 * @param array массив элементов для сортировки
 */
type T = number;

const count = (array: Array<T>): Array<T> => {
    const elements = {};

    array.forEach((i: T) => {
        elements[i] ??= 0;
        elements[i] = elements[i] + 1;
    });

    return Object.keys(elements).map((x: string) => parseInt(x));
};


const arr1 = [20, 12, 3, 53, 13, 1, 14, 8, 2, 19];
const sortedArr1 = [1, 2, 3, 8, 12, 13, 14, 19, 20, 53];

assert(isEqual(count(arr1), sortedArr1));

console.log('done');

export { };
