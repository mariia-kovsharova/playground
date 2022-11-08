/**
 *  Given a string s and an integer k, return the length of the longest substring of s
 *  such that the frequency of each character in this substring is greater than or equal to k.
 */

export function longestSubstring(s: string, k: number): number {
    const inner = (start: number, end: number): number => {
        if (end - start + 1 < k) {
            return 0;
        }

        const map = new Map<string, number>();

        for (let i = start; i <= end; i += 1) {
            const char = s[i];
            map.set(char, (map.get(char) ?? 0) + 1);
        }

        for (let i = start; i <= end; i += 1) {
            if (map.get(s[i])! >= k) {
                continue;
            }

            const left = inner(start, i - 1);
            const right = inner(i + 1, end);

            return left > right ? left : right;
        }

        return end - start + 1;
    };

    return inner(0, s.length - 1);
}
