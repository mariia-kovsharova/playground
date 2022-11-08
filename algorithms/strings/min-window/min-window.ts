function minWindow(s: string, t: string): string {
    let minStart = 0;
    let minSize = Infinity;

    if (s.length < t.length) {
        return '';
    }

    const pattern = new Map<string, number>();
    const substring = new Map<string, number>();

    for (const char of t) {
        pattern.set(char, (pattern.get(char) ?? 0) + 1);
    }

    const keys = Array.from(pattern.keys());

    let start = 0;
    let end = 0;

    const hasMatching = (): boolean => {
        return keys.every((key) => substring.get(key)! >= pattern.get(key)!);
    };

    while (end < s.length) {
        substring.set(s[end], (substring.get(s[end]) ?? 0) + 1);
        end += 1;

        // console.log(s.slice(start, end));
        // console.log('match: ', match);

        while (hasMatching()) {
            const size = end - start;

            //             console.log('matched string: ', s.slice(start, end));
            //             console.log('matched string size: ', size);
            //             console.log('matched string start: ', minStart);

            //             console.log('min: ', minSize);
            //             console.log('min start ', minStart)

            if (size < minSize) {
                minStart = start;
                minSize = size;
            }

            substring.set(s[start], substring.get(s[start])! - 1);
            start += 1;

            // console.log('string after slide: ', s.slice(start, end));
            // console.log('match after slide: ', match);
        }
    }

    return minSize === Infinity ? '' : s.slice(minStart, minStart + minSize);
}
