/**
 * Алгоритм поиска оптимального решения
 * для нахождения максимальной общей подстроки для двух слов:
 * количество символов, идущих подряд, одинаковых для обеих строк
 * 
 *      f i s h
 *          | |
 *      f o s h
 * 
 *      S U B S E Q U E N C E
 *      | | |       / / / /
 *      S U B E    U E N C S
 */

import assert from 'assert';

/**
 * 
 * @param firstWord - первое слово в сравнении
 * @param secondWord - второе слово в сравнении
 * @returns number - максимальную длину подстроки, которая совпадает для обоих слов
 */
const findLongestSubstring = (firstWord: string, secondWord: string): number => {
    // таблица, в которой каждая строка служит определением, какова длина максимальной последовательности
    // для текущей буквы
    const n = firstWord.length;
    const m = secondWord.length;

    let totalMaxSubstring = 0;

    /**
    * Базовые случаи:
    * 
    * 1) Если строка А и строка B имеют длину 0, общая подстрока = 0
    * 2) Если строка А имеет длину i, а строка В имеет длину 0, общая подстрока = 0
    * 3) Если строка А имеет длину 0, а строка В имеет длину j, общая подстрока = 0
    * 
    */

    const table = Array(n + 1);

    // Реализация базового случая 3 (и 1)
    table[0] = Array(m + 1).fill(0);

    for (let i = 1; i <= n; i += 1) {
        table[i] = Array(m + 1);
        // Реализация базового случая 2
        table[i][0] = 0;

        for (let j = 1; j <= m; j += 1) {
            const realI = i - 1;
            const realJ = j - 1;

            const firstWordChar = firstWord[realI];
            const secondWordChar = secondWord[realJ];

            // Если символы не равны друг другу, значит, никакой
            // общей подстроки нет
            if (firstWordChar !== secondWordChar) {
                table[i][j] = 0;
            } else {
                // Если символы равны друг другу, то наибольшая подстрока равна
                // текущему символу (длиной 1) плюс предыдущая общая подстрока,
                // но на символ короче (которая может быть, может не быть)
                const value = 1 + table[i - 1][j - 1];
                table[i][j] = value;

                if (totalMaxSubstring < value) {
                    totalMaxSubstring = value;
                }
            }
        }
    }

    return totalMaxSubstring;
};

const result1 = findLongestSubstring('fish', 'fosh');
const result2 = findLongestSubstring('fish', 'vista');
const result3 = findLongestSubstring('blue', 'clues');
const result4 = findLongestSubstring('test', 'fish');
const result5 = findLongestSubstring('test', 'bullet');
const result6 = findLongestSubstring('SUBSEQUENCE', 'SUBEUENCS');

assert(result1 === 2);
assert(result2 === 2);
assert(result3 === 3);
assert(result4 === 1);
assert(result5 === 0);
assert(result6 === 4);

console.log('done');

export { };
