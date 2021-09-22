/**
 * Слияние
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
const mergeSort = <T>(array: Array<T>): Array<T> => {
    // базовый случай - когда массив имеет длину 0 или 1, он отсортирован
    if (array.length <= 1) {
        return array;
    }

    const middleIndex = Math.floor(array.length / 2);

    const left = mergeSort(array.slice(0, middleIndex));
    const right = mergeSort(array.slice(middleIndex));

    return merge(left, right);
};

export { mergeSort };
