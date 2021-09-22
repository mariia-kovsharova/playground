/**
 * O(n^2)
 * @param array массив элементов для сортировки
 */
const bubbleSort = <T>(array: Array<T>): Array<T> => {
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

export { bubbleSort };
