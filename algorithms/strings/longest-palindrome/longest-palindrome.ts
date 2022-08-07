function longestPalindrome(s: string): string {
    const size = s.length;
    const dp = [...Array(size)].map(() => Array(size).fill(false));

    // base case - when the letter is one
    for (let i = 0; i < size; i += 1) {
        dp[i][i] = true;
    }

    let longestStart = 0;
    let longestLen = 1;

    for (let end = 0; end < size; end += 1) {
        for (let start = end - 1; start >= 0; start -= 1) {
            // look from end backward
            if (s[start] === s[end]) {
                // base case - when two neighbor letters are the palindrome
                const twoSymbols = end - start === 1;
                // or we use result from memo, if less string is the palindrome
                if (twoSymbols || dp[start + 1][end - 1]) {
                    dp[start][end] = true;
                    const len = end - start + 1;
                    if (len > longestLen) {
                        longestStart = start;
                        longestLen = len;
                    }
                }
            }
        }
    }

    return s.slice(longestStart, longestStart + longestLen);
}