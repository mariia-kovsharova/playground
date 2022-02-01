export const generatePermutationsWithoutRepeats = (numeralSystem: number, symbolsCount?: number) => {
    const result: string[] = [];
    const maxSize = symbolsCount ?? numeralSystem;

    const inner = (currentLength = 1, prefix = '') => {
        if (currentLength > maxSize) {
            result.push(prefix);
            return;
        }

        for (let i = 1; i <= numeralSystem; i += 1) {
            if (prefix.includes(i.toString())) {
                continue;
            }

            inner(currentLength + 1, `${prefix}${i}`);
        }

    }

    inner();
    return result;
}
