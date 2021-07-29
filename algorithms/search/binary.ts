import assert from 'assert';
import { isEqual } from 'lodash';

type T = number | string;

/** O(log n)
 * @param array массив элементов, в котором осуществляется поиск
 * @param item элемент, который ищем
 * 
 * Реализация рекурсией
 */
const binaryRec = (array: Array<T>, item: T): number => {
    const inner = (leftIndex: number, rightIndex: number): number => {
        // базовый случай - если длина рассматриваемого массива 1
        if (leftIndex === rightIndex) {
            // если искомый элемент является целевым, возвращаем его индекс, иначе -1
            return item === array[leftIndex] ? leftIndex : -1;
        }

        const middleIndex = Math.floor((leftIndex + rightIndex) / 2);

        if (array[middleIndex] === item) {
            return middleIndex;
        }

        // Если средний элемент меньше, смотрим все справа от него
        // иначе - все слева от него
        return array[middleIndex] < item
            ? inner(middleIndex + 1, rightIndex)
            : inner(leftIndex, middleIndex - 1);
    }

    return inner(0, array.length - 1);
};

/** O(log n)
 * @param array массив элементов, в котором осуществляется поиск
 * @param item элемент, который ищем
 * 
 * Реализация циклом
 */
const binary = (array: Array<T>, item: T): number => {
    let leftIndex = 0;
    let rightIndex = array.length - 1;

    while (leftIndex <= rightIndex) {
        const middleIndex = Math.floor((leftIndex + rightIndex) / 2);

        if (array[middleIndex] === item) {
            return middleIndex;
        }

        // Если средний элемент меньше, левой границей становится следующий элемент
        if (array[middleIndex] < item) {
            leftIndex = middleIndex + 1;
        } else {
            // Иначе средний элемент больше, и правой границей становится предыдущий элемент
            rightIndex = middleIndex - 1;
        }
    }

    return -1;
};

const arr1 = [1, 2, 3, 8, 9, 12, 13, 14, 19, 20, 53];

assert(isEqual(binaryRec(arr1, 13), 6));
assert(isEqual(binaryRec(arr1, 3), 2));
assert(isEqual(binaryRec(arr1, 1), 0));
assert(isEqual(binaryRec(arr1, 20), 9));
assert(isEqual(binaryRec(arr1, 53), 10));
assert(isEqual(binaryRec(arr1, 42), -1));

assert(isEqual(binary(arr1, 13), 6));
assert(isEqual(binary(arr1, 3), 2));
assert(isEqual(binary(arr1, 1), 0));
assert(isEqual(binary(arr1, 20), 9));
assert(isEqual(binary(arr1, 53), 10));
assert(isEqual(binary(arr1, 42), -1));

console.log('done');

export { };
