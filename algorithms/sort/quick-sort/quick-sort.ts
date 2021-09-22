/**
 * O(n * log(n))
 * @param array массив элементов для сортировки
 */
const quickSort = <T>(array: Array<T>): Array<T> => {
    // базовый случай - когда массив имеет длину 0 или 1, он отсортирован
    if (array.length <= 1) {
        return array;
    }

    const middleIndex = Math.floor(array.length / 2);
    const middleElement = array[middleIndex];

    const less = array.filter((i: T) => i < middleElement);
    const middle = array.filter((i: T) => i === middleElement);
    const greather = array.filter((i: T) => i > middleElement);

    return [...quickSort(less), ...middle, ...quickSort(greather)];
};

export { quickSort };
