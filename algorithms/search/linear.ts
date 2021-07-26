import assert from 'assert';
import { isEqual } from 'lodash';

/** O(n)
 * @param array массив элементов, в котором осуществляется поиск
 * @param item элемент, который ищем
 */
type T = number | string;

const linear = (array: Array<T>, item: T): number | null => {
    for (let i = 0; i < array.length; i += 1) {
        if (array[i] === item) {
            return i;
        }
    }
    return null;
};


const arr1 = [20, 12, 3, 53, 13, 1, 14, 8, 2, 19];

assert(isEqual(linear(arr1, 53), 3));
assert(isEqual(linear(arr1, 42), null));

console.log('done');

export { };
