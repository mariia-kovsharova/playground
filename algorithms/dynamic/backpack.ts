/**
 * Алгоритм поиска оптимального решения
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
    // таблица, в которой каждая строка служит для подсчета максимальной ценности для текущего элемента
    const table = Array(items.length);
    // totalMaxValue - глобальный максимум в рюкзаке
    let totalMaxValue = 0;

    for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        // для каждого элемента создаем "подрюкзак"
        table[i] = Array(backpackSize);

        // вычисление значений для "подрюкзаков" меньшего размера
        for (let j = 0; j < backpackSize; j += 1) {
            let currentBackpackEmptySpace = j + 1;
            console.log(`try to put the ${item.name} to backpack with size ${currentBackpackEmptySpace}`);

            if (item.weigth > currentBackpackEmptySpace) {
                // предмет не вмещается, он слишком тяжелый
                console.log(`can not do it! the ${item.name} is too heavy`);
                // текущая ценность - значение ценности предыдущего предмета или 0, если предыдущего предмета нет
                const currentValue = i > 0 ? table[i - 1][j] : 0;
                table[i][j] = currentValue;
                continue;
            }

            currentBackpackEmptySpace -= item.weigth;

            if (!currentBackpackEmptySpace) {
                console.log('the backpack is full');
                // если места больше нет, наибольшую текущую ценность составляет максимум между стоимостью
                // текущего предмета и стоимостью предыдущего предмета в том же "подрюкзаке";
                const currentItemValue = item.price;
                const previousItemValue = i > 0 ? table[i - 1][j] : 0;

                table[i][j] = Math.max(currentItemValue, previousItemValue);
                // если текущая ценность больше общей максимальной, она становится максимальной
                if (totalMaxValue < table[i][j]) {
                    totalMaxValue = table[i][j];
                }
            } else {
                const currentItemValue = item.price;
                const restSpaceIndex = currentBackpackEmptySpace - 1;
                const previousItemAdditionalValue = i > 0 ? table[i - 1][restSpaceIndex] : 0;

                // сумма стоимости текущего предмета плюс предыдущего предмета, который влезает
                // в оставшееся место
                const summaryCurrentMaxValue = currentItemValue + previousItemAdditionalValue;

                const previousItemValue = i > 0 ? table[i - 1][j] : 0;

                table[i][j] = Math.max(summaryCurrentMaxValue, previousItemValue);

                if (totalMaxValue < table[i][j]) {
                    totalMaxValue = table[i][j];
                }
            }
        }
    }
    return totalMaxValue;
};

const guitar = new Item('guitar', 1, 1500);
const radio = new Item('radio', 4, 3000);
const notebook = new Item('notebook', 3, 2000);

const result1 = calculcateMaxValue(4, [guitar, radio, notebook]);

console.log(result1);

assert(result1 === 3500);

const water = new Item('water', 3, 10);
const book = new Item('book', 1, 3);
const food = new Item('food', 2, 9);
const jaket = new Item('jacket', 2, 5);
const camera = new Item('camera', 1, 6);

const result2 = calculcateMaxValue(6, [water, book, food, jaket, camera]);
assert(result2 === 25);

export { };
