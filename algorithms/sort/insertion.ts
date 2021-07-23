import assert from 'assert';
import { isEqual } from 'lodash';

/**
 * O(n^2)
 * @param array массив элементов для сортировки
 */
const insertion = <T>(array: Array<T>): Array<T> => {
    const copy = array.slice();

    for (let i = 1; i < copy.length; i += 1) {
        // текущая позиция обрабатываемого элемента
        let current = i;
        // пока обрабатываемый элемент больше предыдущего и его текущий индекс больше первого элемента массива
        // "тащим" его до тех пор, пока он не станет первым или предыдущий элемент не будет меньше
        // (это будет означать, что мы нашли место, куда должен быть вставлен обрабатываемый элемент)
        while (current > 0 && copy[current] < copy[current - 1]) {
            [copy[current], copy[current - 1]] = [copy[current - 1], copy[current]];
            // теперь элемент сдвинут назад, его текущий индекс стал меньше
            current -= 1;
        }
    }

    return copy;
};

const arr1 = [20, 12, 3, 53, 13, 1, 14, 8, 2, 19];
const arr2 = ['test', 'cat', 'do', 'abc', 'a', 'dod', 'ab', 'tst'];

const sortedArr1 = [1, 2, 3, 8, 12, 13, 14, 19, 20, 53];
const sortedArr2 = ['a', 'ab', 'abc', 'cat', 'do', 'dod', 'test', 'tst'];

assert(isEqual(insertion(arr1), sortedArr1));
assert(isEqual(insertion(arr2), sortedArr2));

console.log('done');

export { };
