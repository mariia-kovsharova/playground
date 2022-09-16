export function suggestedWords(words: string[], searchWord: string): string[][] {
    const suggestionMaxCount = 3;

    words.sort();

    const getLowerBound = (start: number, target: string): number => {
        let left = start;
        let right = words.length;

        while (left < right) {
            const middle = left + Math.trunc((right - left) / 2);

            if (words[middle] === target) {
                return middle;
            }

            if (words[middle] <= target) {
                left = middle + 1;
            } else {
                right = middle;
            }
        }

        return words[left] >= target ? left : -1;
    }

    const result: string[][] = [];
    let typing = '';
    let start = 0;

    for (const char of searchWord) {
        typing += char;

        const inner: string[] = [];
        const lower = getLowerBound(start, typing);

        if (lower !== -1) {
            start = lower;
            const max = Math.min(lower + suggestionMaxCount, words.length);

            for (let i = lower; i < max; i += 1) {
                if (words[i].startsWith(typing)) {
                    inner.push(words[i]);
                }
            }
        }

        result.push(inner);
    }

    return result;
}