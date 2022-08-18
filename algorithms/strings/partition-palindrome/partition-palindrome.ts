function partition(s: string): string[][] {
    const len = s.length;

    const dp: boolean[][] = new Array(len);

    // every single char is a palindrome
    for (let ind = 0; ind < len; ind += 1) {
        dp[ind] = Array(len).fill(false);
        dp[ind][ind] = true;
    }

    const result: string[][] = [];

    const isPalindrome = (start: number, end: number): boolean => {
        if (s[start] !== s[end]) {
            return false;
        }

        // one or two char
        if (end - start <= 1) {
            return true;
        }

        return dp[start + 1][end - 1];
    }

    const getCandidates = (start: number, current: string[]) => {
        if (start >= len) {
            result.push(current.slice());
            return;
        }

        for (let end = start; end < len; end += 1) {
            if (isPalindrome(start, end)) {
                // update table
                dp[start][end] = true;
                // add current to the list
                current.push(s.slice(start, end + 1));
                // search inside the rest
                getCandidates(end + 1, current);
                // backtracking
                current.pop();
            }
        }
    }

    getCandidates(0, []);

    return result;
}