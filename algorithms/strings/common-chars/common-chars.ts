export function commonChars(words: string[]): string[] {
    // to find minimum count we have to fill the array with max
    const arr = new Array(26).fill(Number.MAX_SAFE_INTEGER);
    const OFFSET = 97;

    for (const word of words) {
        // count the count of each letter in the word
        const arr2 = new Array(26).fill(0);

        for (const c of word) {
            const ind = c.charCodeAt(0) - OFFSET;
            arr2[ind]++;
        }

        // then in the main array we should update the minimum count
        // f.e. if the first word has three "a" letters and the second
        // word has only one "a" letter, the max common "a" letter is 1 (by min)
        for (let i = 0; i < 26; i += 1) {
            arr[i] = Math.min(arr[i], arr2[i]);
        }
    }

    const result: string[] = [];

    for (let i = 0; i < 26; i += 1) {
        while (arr[i] > 0) {
            result.push(String.fromCharCode(i + OFFSET));
            arr[i] -= 1;
        }
    }

    return result;
}