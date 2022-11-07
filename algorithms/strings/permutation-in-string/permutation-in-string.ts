export function checkInclusion(pattern: string, sequence: string): boolean {
    if (pattern.length > sequence.length) {
        return false;
    }

    const size = pattern.length - 1;
    const code = 97;

    const patternSymbols = new Array(26).fill(0);
    const stringSymbols = new Array(26).fill(0);

    const matches = (): boolean => {
        for (let i = 0; i < pattern.length; i += 1) {
            if (patternSymbols[i] !== stringSymbols[i]) {
                return false;
            }
        }

        return true;
    }

    for (const s of pattern) {
        const index = s.charCodeAt(0) - code;
        patternSymbols[index] += 1;
    }

    for (let i = 0; i <= size; i += 1) {
        const index = sequence[i].charCodeAt(0) - code;
        stringSymbols[index] += 1;
    }

    let start = 0;
    let end = size;

    while (end < sequence.length - 1) {
        if (matches()) {
            return true;
        }

        const startIndex = sequence[start].charCodeAt(0) - code;
        stringSymbols[startIndex] -= 1;

        start += 1;
        end += 1;

        const endIndex = sequence[end].charCodeAt(0) - code;
        stringSymbols[endIndex] += 1;
    }

    return matches();
}