/** O(log n)
 * @param array массив элементов, в котором осуществляется поиск
 * @param item элемент, который ищем
 * 
 * Реализация рекурсией
 */
const binarySearchRecursive = <T>(array: Array<T>, item: T): number | null => {
    const inner = (leftIndex: number, rightIndex: number): number | null => {
        // базовый случай - если длина рассматриваемого массива 1
        if (leftIndex === rightIndex) {
            // если искомый элемент является целевым, возвращаем его индекс, иначе null
            return item === array[leftIndex] ? leftIndex : null;
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
const binarySearch = <T>(array: Array<T>, item: T): number | null => {
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

    return null;
};

export { binarySearchRecursive, binarySearch };
