/**
 * Алгоритм поиска оптимального решения
 * для нахождения максимальной общей подстроки для двух словы
 * 
 *      f i s h
 *          | |
 *      f o s h
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
    const table = Array(firstWord.length);
    // totalMaxSubstring - максимальная последовательность
    let totalMaxSubstring = 0;

    for (let i = 0; i < table.length; i += 1) {
        table[i] = Array(secondWord.length);

        for (let j = 0; j < secondWord.length; j += 1) {
            const firstWordChar = firstWord[j];
            const secondWordChar = secondWord[j];

            if (firstWordChar !== secondWordChar) {
                table[i][j] = 0;
            } else {
                const value = i > 0 ? table[i - 1][j - 1] + 1 : 1;
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

assert(result1 === 2);
assert(result2 === 2);
assert(result3 === 3);
assert(result4 === 1);
assert(result5 === 0);

console.log('done');

export { };
