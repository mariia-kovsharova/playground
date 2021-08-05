/**
 * Алгоритм поиска оптимального решения
 * для нахождения наибольшей общей подпоследовательности (НОП) для двух слов:
 * количество букв в последовательности, общих для двух строк (слов) - те же буквы в той же позиции
 * в обоих словах
 * 
 *      f i s h
 *      |   | |
 *      f o s h
 * 
 */

import assert from 'assert';

/**
 * 
 * @param firstWord - первое слово в сравнении
 * @param secondWord - второе слово в сравнении
 * @returns number - максимальное количество совпадений букв на одинаковых позициях у 2 слов
 */
const findLongestSequance = (firstWord: string, secondWord: string): number => {
    // таблица, в которой каждая строка служит определением, сколько общих букв с 1 словом
    // имеет второе слово ПОБУКВЕННО
    const n = firstWord.length;
    const m = secondWord.length;

    const table = Array(n);

    /**
     * Базовые случаи:
     * 
     * 1) Если строка А и строка B имеют длину 0, общая подпоследовательность = 0
     * 2) Если строка А имеет длину i, а строка В имеет длину 0, общая подпоследовательность = 0
     * 3) Если строка А имеет длину 0, а строка В имеет длину j, общая подпоследовательность = 0
     * 
     */

    table[0] = Array(m + 1).fill(0);

    for (let i = 1; i <= n; i += 1) {
        table[i] = Array(m + 1);
        table[i][0] = 0;

        for (let j = 1; j <= m; j += 1) {

            // Индекс будет на 1 меньше, т.к. в первой строке и столбце матрицы - базовый случай         

            const realIndex = j - 1;

            const firstWordChar = firstWord[realIndex];
            const secondWordChar = secondWord[realIndex];

            if (firstWordChar == secondWordChar) {
                // Если символы равны, максимальная длина подпоследовательности
                // (1 + максимальная длина для строк на символ меньше (что для 1 строки, что для 2) )

                /**
                 * Можно обойтись без заполнения первой строки и столбца нулями, но тогда надо делать
                 *  проверку на валидность индекса (первый вариант)
                 * 
                 *  len = i > 0 ? table[i - 1][j - 1] + 1 : 1; - т.е. тут либо 1, либо 1 + что-то
                 */
                const len = table[i - 1][j - 1] + 1;
                table[i][j] = len;
            } else {
                // Иначе, если символы не равны, выбирается максимум между:

                // НОП( (строка А - последний символ), (строка В) )
                const top = table[i - 1][j];
                // НОП( (строка А), (строка В - последний символ) )
                const left = table[i][j - 1];

                table[i][j] = Math.max(top, left);
            }
        }
    }
    return table[n][m];
};


const result1 = findLongestSequance('fish', 'fosh');
const result2 = findLongestSequance('fish', 'vista');
const result3 = findLongestSequance('forest', 'clue');
const result4 = findLongestSequance('test', 'tishes');
const result5 = findLongestSequance('test', 'bullet');

assert(result1 === 3);
assert(result2 === 2);
assert(result3 === 1);
assert(result4 === 2);
assert(result5 === 0);

console.log('done');

export { };
