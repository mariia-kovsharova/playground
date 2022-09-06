export function wordBreak(s: string, wordDict: string[]): boolean {
    const size = s.length;
    const dict = new Set<string>(wordDict);

    const dp = new Array(size + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= size; i += 1) {
        for (let j = 0; j < i; j += 1) {
            if (dp[j] === true) {
                const prefix = s.slice(j, i);
                // console.log(prefix);
                dp[i] = dict.has(prefix);
                if (dp[i]) {
                    break;
                }
            }
        }
    }

    // console.log(dp);

    return dp[size];
}

function wordBreakDfs(s: string, wordDict: string[]): boolean {
    const size = s.length;
    const dict = new Set<string>(wordDict);
    const visited = new Set<number>();

    const dfs = (start: number): boolean => {
        if (size === start) {
            return true;
        }

        for (let i = start + 1; i <= size; i += 1) {
            const prefix = s.slice(start, i);

            if (visited.has(i)) {
                continue;
            }

            if (dict.has(prefix)) {
                const next = dfs(i);

                if (next) {
                    return true;
                }

                visited.add(i);
            }
        }

        return false;
    }

    return dfs(0);
}