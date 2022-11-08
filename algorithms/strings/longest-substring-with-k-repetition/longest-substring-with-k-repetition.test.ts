import { longestSubstring } from './longest-substring-with-k-repetition';

describe('Longest Substring with At Least K Repeating Characters', () => {
    it('"aaabb" and 3 times', () => {
        const string = 'aaabb';
        const count = 3;
        // Explanation: The longest substring is "aaa", as 'a' is repeated 3 times.
        expect(longestSubstring(string, count)).toBe(3);
    });

    it('"ababbc" and 2 times', () => {
        const string = 'ababbc';
        const count = 2;
        // The longest substring is "ababb", as 'a' is repeated 2 times and 'b' is repeated 3 times.
        expect(longestSubstring(string, count)).toBe(5);
    });
});
