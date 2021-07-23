import assert from 'assert';
import { isEqual } from 'lodash';

/**
 * O(n^2)
 * @param array массив элементов для сортировки
 */
const selection = <T>(array: Array<T>): Array<T> => {
    const copy = array.slice();

    // i - индекс текущего обрабатываемого элемента
    for (let i = 0; i < copy.length - 1; i += 1) {
        // начинаем просматривать массив со следующего элемента
        // т.к. считаем, что все, что было ДО i - уже отсортировано
        for (let j = i + 1; j < copy.length; j += 1) {
            // если следующий элемент меньше, он становится на место последнего в отсортированном массиве (i-ый)
            // и так проверяем все элементы не отсортированного массива, находя минимальный
            if (copy[j] < copy[i]) {
                [copy[j], copy[i]] = [copy[i], copy[j]];
            }
        }
    }

    return copy;
};

const arr1 = [20, 12, 3, 53, 13, 1, 14, 8, 2, 19];
const arr2 = ['test', 'cat', 'do', 'abc', 'a', 'dod', 'ab', 'tst'];

const sortedArr1 = [1, 2, 3, 8, 12, 13, 14, 19, 20, 53];
const sortedArr2 = ['a', 'ab', 'abc', 'cat', 'do', 'dod', 'test', 'tst'];

assert(isEqual(selection(arr1), sortedArr1));
assert(isEqual(selection(arr2), sortedArr2));

console.log('done');

export { };
