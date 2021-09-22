/** O(n)
 * @param array массив элементов, в котором осуществляется поиск
 * @param item элемент, который ищем
 */
const linearSearch = <T>(array: Array<T>, item: T): number | null => {
    for (let i = 0; i < array.length; i += 1) {
        if (array[i] === item) {
            return i;
        }
    }
    return null;
};

export { linearSearch };
