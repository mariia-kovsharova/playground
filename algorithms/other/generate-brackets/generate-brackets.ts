export const generateBrackets = (num: number): string => {
    const symbolsCount = 2 * num;
    const result: string[] = [];

    const inner = (
        openedCount: number,
        closedCount: number,
        currentSymbolsCount: number,
        prefix: string = ''
    ): void => {
        // Базовый случай, когда все символы использованы
        if (currentSymbolsCount === symbolsCount) {
            result.push(prefix);
        }

        // Для "открывающихся" скобок корректно выражение
        // "вставляй, пока вставляется" - до тех пор, пока их количество меньше
        // исходного, можно вставлять. Как только оно равно исходному, больше
        // открывающиеся скобки вставлять нельзя
        if (openedCount < num) {
            const updatedPrefix = `${prefix}(`;
            inner(
                openedCount + 1,
                closedCount,
                currentSymbolsCount + 1,
                updatedPrefix
            );
        }

        // Для закрывающихся скобок, однако, корректно иное выражение - 
        // пока открытых скобок больше, чем закрытых, мы должны вставлять
        // закрывающиеся скобки, НЕ ЗАБЫВАЯ при этом увеличивать количество символов
        // (ЧТОБЫ ОСТАНОВИТЬСЯ НА БАЗОВОМ СЛУЧАЕ!!!!)
        if (openedCount > closedCount) {
            const updatedPrefix = `${prefix})`;
            inner(
                openedCount,
                closedCount + 1,
                currentSymbolsCount + 1,
                updatedPrefix
            );
        }
    };

    inner(0, 0, 0);

    return result.join(',');
}
