/**
 * Алгоритм поиска оптимального решения
 */

class Item {
    constructor(public name: string, public weigth: number, public price: number) {}
}

const guitar = new Item('guitar', 1, 1500);
const radio = new Item('radio', 4, 3000);
const notebook = new Item('notebook', 3, 2000);

/**
 *
 * @param backpackSize - размер рюкзака, в которй необходимо положить предметы так, чтобы их стоимость была максимальной
 * @param items - массив элементов, которые можно положить в рюкзак
 * @returns number - максимальная стоимость элементов, которые можно унести в рюкзаке
 */
const calculcateMaxValue = (backpackSize: number, items: ReadonlyArray<Item>): number => {
    // таблица, в которой каждая строка служит для подсчета максимальной ценности для текущего элемента
    const table = Array(items.length);
    let maxValue = 0;

    for (let i = 0; i < items.length; i += 1) {
        // для каждого элемента создаем "подрюкзак"
        table[i] = Array(backpackSize);

        // вычисление значений для "подрюкзаков" меньшего размера
        for (let j = 0; j < backpackSize; j += 1) {
            let currentBackpackEmptySpace = j + 1;

            const item = items[i];

            console.log(`try to put the ${item.name} to backpack with size ${currentBackpackEmptySpace}`);

            if (item.weigth > currentBackpackEmptySpace) {
                // предмет не вмещается, он слишком тяжелый
                console.log(`can not do it! the ${item.name} is too heavy`);
                // в таблицу берется значение макс ценности предыдущего предмета или null, если предыдущего предмета нет
                table[i][j] = i > 0 ? table[i - 1][j] : null;
                continue;
            }

            table[i][j] = item.price;
            currentBackpackEmptySpace -= item.weigth;

            if (currentBackpackEmptySpace === 0) {
                // если места больше нет, наибольшую текущую ценность составляет текущий элемент в рюкзаке
                console.log('the backpack is full');
                // если текущая ценность больше максимальной, она становится максимальной
                if (maxValue < table[i][j]) {
                    maxValue = table[i][j];
                }
            } else {
                if (i > 0) {
                    const currentItemMaxValue = table[i][j];
                    const previousItemMaxValue = table[i - 1][currentBackpackEmptySpace - 1];
                    // текущая ценность складываеся из суммы ценности текущего элемента и суммы ценности
                    // элемента, который влезает в оставшееся место
                    const summaryValue = currentItemMaxValue + previousItemMaxValue;
                    table[i][j] = summaryValue;

                    // если текущая ценность больше максимальной, она становится максимальной
                    if (maxValue < summaryValue) {
                        maxValue = summaryValue;
                    }
                } else {
                    console.log(
                        `the backpack value is ${table[i][j]}, the empty space is ${currentBackpackEmptySpace}, but other items are too heavy`
                    );
                }
            }
        }
    }
    return maxValue;
};

const result = calculcateMaxValue(4, [guitar, radio, notebook]);
console.log(`the max value is ${result}`);

export {};
