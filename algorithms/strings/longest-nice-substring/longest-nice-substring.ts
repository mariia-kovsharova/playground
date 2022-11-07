// A string s is nice if, for every letter of the alphabet that s contains,
// it appears both in uppercase and lowercase.

export function longestNiceSubstring(s: string): string {
    if (s.length < 2) {
        return '';
    }

    const set = new Set<string>();

    for (const char of s) {
        set.add(char);
    }

    for (let i = 0; i < s.length; i += 1) {
        const char = s[i];

        if (set.has(char.toLowerCase()) && set.has(char.toUpperCase())) {
            continue;
        }

        const left = longestNiceSubstring(s.slice(0, i));
        const right = longestNiceSubstring(s.slice(i + 1));

        return left.length >= right.length ? left : right;
    }

    return s;
}