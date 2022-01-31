export const generateNumbers = (numeralSystem: number, symbolsCount: number) => {
    const result: string[] = [];

    const inner = (currentLength = 1, prefix = '') => {
        if (currentLength > symbolsCount) {
            result.push(prefix);
            return;
        }

        for (let i = 0; i < numeralSystem; i += 1) {
            inner(currentLength + 1, `${prefix}${i}`);
        }

    }

    inner();
    return result;
}
