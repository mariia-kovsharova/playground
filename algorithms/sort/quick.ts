/**
 * O(n * log(n))
 * @param array массив элементов для сортировки
 */
const quick = <T>(array: Array<T>): Array<T> => {
    // базовый случай - когда массив имеет длину 0 или 1, он отсортирован
    if (array.length === 0 || array.length === 1) {
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

console.log(quick(arr1));
console.log(quick(arr2));

export {};
