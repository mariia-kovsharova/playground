/**
 * Алгоритм поиска оптимального решения
 * для нахождения максимальной подпоследовательности для двух слов - какое количество
 * букв на тех же местах совпадает у одного слова
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
    const table = Array(firstWord.length);
    // totalCountsOfTheSameChars - максимальная последовательность
    let totalCountsOfTheSameChars = 0;

    for (let i = 0; i < table.length; i += 1) {
        table[i] = Array(secondWord.length);

        for (let j = 0; j < secondWord.length; j += 1) {
            const firstWordChar = firstWord[j];
            const secondWordChar = secondWord[j];

            if (firstWordChar !== secondWordChar) {
                const top = i > 0 ? table[i - 1][j] : 0;
                const left = j > 0 ? table[i][j - 1] : 0;

                const maxLen = Math.max(top, left);
                table[i][j] = maxLen;
            } else {
                const currentLength = i > 0 ? table[i - 1][j - 1] + 1 : 1;
                const previousLength = i > 0 ? table[i - 1][j] : 0;

                const maxLen = Math.max(currentLength, previousLength);
                table[i][j] = maxLen;

                if (totalCountsOfTheSameChars < maxLen) {
                    totalCountsOfTheSameChars = maxLen;
                }
            }
        }
    }

    return totalCountsOfTheSameChars;
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
