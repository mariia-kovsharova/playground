function lengthOfLongestSubstring(s: string): number {
    const map = new Map<string, number>();
    let max = 0;

    let left = 0;

    for (let right = 0; right < s.length; right += 1) {

        if (map.has(s[right])) {
            // not in current window, just update max
            if (map.get(s[right])! < left) {
                max = Math.max(max, right - left + 1);
            } else {
                // symbol is in current window, we should slide
                left = map.get(s[right])! + 1;
            }
        } else {
            // we have not seen this char at current iteration so we can update max
            max = Math.max(max, right - left + 1);
        }

        map.set(s[right], right);
    }

    return max;
}