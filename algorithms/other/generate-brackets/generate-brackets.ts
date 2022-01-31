export const generateBrackets = (pairsCount: number): string => {
    const result: string[] = [];

    const inner = (leftBracketsCount: number, rightBracketsCount: number): string => {
        if (!leftBracketsCount && !rightBracketsCount) {
            return '';
        }

        if (leftBracketsCount >= 1) {
            return `(${inner(leftBracketsCount - 1, rightBracketsCount)}`;
        }

        if (!leftBracketsCount && rightBracketsCount >= 1) {
            return `${inner(leftBracketsCount, rightBracketsCount - 1)})`;
        }

        return 'foo';
    };

    for (let i = 0; i <= pairsCount; i += 1) {
        const size = pairsCount - i + (result.length - 1);
        const w = inner(size, size);
        result.push(w);
    }

    return result.join(',');
}
