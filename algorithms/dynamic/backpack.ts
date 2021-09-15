/**
 * Алгоритм поиска оптимального решения
 * для нахождения максимальной ценности предметов в рюкзаке размерностью N
 */

import assert from 'assert';

class Item {
    constructor(public name: string, public weigth: number, public price: number) { }
}

/**
 *
 * @param backpackSize - размер рюкзака, в которй необходимо положить предметы так, чтобы их стоимость была максимальной
 * @param items - массив элементов, которые можно положить в рюкзак
 * @returns number - максимальная стоимость элементов, которые можно унести в рюкзаке
 */
const calculcateMaxValue = (backpackSize: number, items: ReadonlyArray<Item>): number => {
    // totalMaxValue - глобальный максимум в рюкзаке
    let totalMaxValue = 0;

    /**
     * Базовые случаи:
     * 
     * 1) Если рюкзак размера 0, максимальная ценность = 0
     * 2) Если ценность весом 0, максимальная ценность = 0
     * 
     */

    // таблица, в которой каждая строка служит для подсчета максимальной ценности для текущего элемента
    const table = Array(items.length + 1);

    for (let i = 0; i < table.length; i += 1) {
        table[i] = Array(backpackSize + 1).fill(0);
    }

    /**
     * Первая строка и первый столбец - базовые случаи 1 и 2
     */

    for (let i = 1; i <= items.length; i += 1) {
        // т.к. первый столбец - "фейковый", из массива итемов берем предыдущий элемент
        const item = items[i - 1];

        // вычисление значений для "подрюкзаков" меньшего размера
        for (let j = 1; j <= backpackSize; j += 1) {
            let currentBackpackEmptySpace = j;
            console.log(`try to put the ${item.name} to backpack with size ${currentBackpackEmptySpace}`);

            if (item.weigth > currentBackpackEmptySpace) {
                // предмет не вмещается, он слишком тяжелый
                console.log(`can not do it! the ${item.name} is too heavy`);
                // текущая ценность - значение ценности предыдущего предмета или 0 (базовый случай)
                table[i][j] = table[i - 1][j];
                continue;
            }

            const restSpaceIndex = currentBackpackEmptySpace - item.weigth;

            // Ценность предмета, который может влезть в оставшееся место
            const itemThatCanFitsInRestSpace = table[i - 1][restSpaceIndex];

            // сумма стоимости текущего предмета плюс предыдущего предмета, который влезает
            // в оставшееся место
            const summaryCurrentMaxValue = item.price + itemThatCanFitsInRestSpace;

            // Стоимость предыдущего предмета (-ов), которые могут влезть в рюкзак
            // такого же размера
            const previousItemsValue = table[i - 1][j];

            table[i][j] = Math.max(summaryCurrentMaxValue, previousItemsValue);

            if (totalMaxValue < table[i][j]) {
                totalMaxValue = table[i][j];
            }
        }
    }

    // На самом деле, можно просто вернуть крайний правый нижний элемент из таблицы
    // но так проще для понимания
    return totalMaxValue;
};

const guitar = new Item('guitar', 1, 1500);
const radio = new Item('radio', 4, 3000);
const notebook = new Item('notebook', 3, 2000);

const result1 = calculcateMaxValue(4, [guitar, radio, notebook]);
assert(result1 === 3500);

const water = new Item('water', 3, 10);
const book = new Item('book', 1, 3);
const food = new Item('food', 2, 9);
const jaket = new Item('jacket', 2, 5);
const camera = new Item('camera', 1, 6);

const result2 = calculcateMaxValue(6, [water, book, food, jaket, camera]);
assert(result2 === 25);

export { };
