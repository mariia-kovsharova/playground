// O(n) time, O(1) space, dp?
export function canJump(nums: number[]): boolean {
    const len = nums.length;
    let targetIndex = len - 1;

    for (let i = targetIndex - 1; i >= 0; i -= 1) {
        if (i + nums[i] >= targetIndex) {
            targetIndex = i;
        }
    }

    return targetIndex === 0;
}

// O(n^3) time? O(n) extra space
export function canJumpLarge(nums: number[]): boolean {
    const len = nums.length;

    const visited = new Array(len).fill(false);
    visited[0] = true;

    for (let i = 1; i < len; i += 1) {
        for (let j = i - 1; j >= 0; j -= 1) {
            if (visited[j] && j + nums[j] >= i) {
                visited[i] = true;
            }
        }
    }

    return visited[len - 1];
}

// Greedy version, O(n) time, O(1) space

export function canJumpGreedy(nums: number[]): boolean {
    let maxReachableIndex = 0;
    for (let i = 0; i < nums.length; i += 1) {
        if (maxReachableIndex < i) {
            return false;
        }

        maxReachableIndex = Math.max(maxReachableIndex, i + nums[i]);
    }

    return true;
}