import assert from 'assert';
import { isEqual } from 'lodash';

/**
 * O(n^2)
 * @param array массив элементов для сортировки
 */
const bubble = <T>(array: Array<T>): Array<T> => {
    const copy = array.slice();
    /**
     * @pass - количество проходов по массиву
     */
    for (let pass = 1; pass < copy.length - 1; pass += 1) {
        // за каждый проход самый "тяжелый" элемент уходит в конец,
        // поэтому нет необходимости доходить до него (делаем обход по неотсортированной части массива)
        for (let i = 0; i < copy.length - pass; i += 1) {
            if (copy[i] > copy[i + 1]) {
                [copy[i], copy[i + 1]] = [copy[i + 1], copy[i]];
            }
        }
    }

    return copy;
};

const arr1 = [20, 12, 3, 53, 13, 1, 14, 8, 2, 19];
const arr2 = ['test', 'cat', 'do', 'abc', 'a', 'dod', 'ab', 'tst'];

const sortedArr1 = [1, 2, 3, 8, 12, 13, 14, 19, 20, 53];
const sortedArr2 = ['a', 'ab', 'abc', 'cat', 'do', 'dod', 'test', 'tst'];

assert(isEqual(bubble(arr1), sortedArr1));
assert(isEqual(bubble(arr2), sortedArr2));

console.log('done');

export { };
