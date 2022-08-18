export function longestCommonPrefix(strs: string[]): string {
    if (strs.length === 0) {
        return '';
    }

    const common = (prefix1: string, prefix2: string): string => {
        let p1 = 0;
        let p2 = 0;

        while (p1 < prefix1.length && p2 < prefix2.length && prefix1[p1] === prefix2[p2]) {
            p1 += 1;
            p2 += 1;
        }

        return prefix1.slice(0, p1);
    }

    const longestInGroup = (left: number, right: number): string => {
        if (left === right) {
            return strs[left];
        }

        const middle = left + Math.trunc((right - left) / 2);

        const l = longestInGroup(left, middle);
        const r = longestInGroup(middle + 1, right);

        return common(l, r);
    }

    return longestInGroup(0, strs.length - 1);
}


