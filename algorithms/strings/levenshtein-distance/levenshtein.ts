export const levenshteinDistance = (firstWord: string, secondWord: string): number => {
    const firstTableSize = firstWord.length + 1;
    const secondTableSize = secondWord.length + 1;

    /**
     * Базовые случаи:
     * 1) Когда длина строки А равна нулю и длина строки Б равна нулю, расстояние равно нулю
     * 2) Когда длина строки А равна N, а длина строки Б равна нулю, расстояние равно N
     * 3) Когда длина строки А равна нулю, а длина строки Б равна N, расстояние равно N
     *  
     * 
     *  |   | 0 | 1 | 2 | 3 | 4 | 5  
     *  | 0 | 0 | F | I | R | S | T
     *  | 1 | S |
     *  | 2 | E |
     *  | 3 | C |
     *  | 4 | O |
     *  | 5 | N |
     *  | 6 | D |
     */

    const table: number[][] = Array(firstTableSize);

    // Базовые случаи 1, 2 и 3
    for (let i = 0; i < firstTableSize; i += 1) {
        table[i] = Array(secondTableSize);
        table[i][0] = i;

        for (let j = 1; j < secondTableSize; j += 1) {
            table[0][j] = j;
        }
    }

    for (let i = 1; i < firstTableSize; i += 1) {
        for (let j = 1; j < secondTableSize; j += 1) {
            const realI = i - 1;
            const realJ = j - 1;

            if (firstWord[realI] === secondWord[realJ]) {
                // Если символы одинаковые, преобразования не нужны
                // и расстояние равно расстоянию для подстроки на символ меньше
                table[i][j] = table[i - 1][j - 1];
            } else {
                // Если символы не равны, значит необходимо провести
                // ОДНО преобразование плюс выбрать минимальное преобразование из:
                // * замены одного символа (table[i-1][j-1])
                // * удалению или добавлению символа в первое слово (table[i-1][j])
                // * удалению или добавлению символа во второе слово (table[i][j-1])
                table[i][j] = 1 + Math.min(table[i - 1][j], table[i][j - 1], table[i - 1][j - 1]);
            }
        }
    }

    return table[firstTableSize - 1][secondTableSize - 1];
}