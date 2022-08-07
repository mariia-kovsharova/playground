export function canJump(nums: number[]): boolean {
    const len = nums.length;

    const visited = new Array(len).fill(false);
    visited[0] = true;

    for (let i = 1; i < len; i += 1) {
        for (let j = i - 1; j >= 0; j -= 1) {
            if (j + nums[j] >= i) {
                visited[i] = true;
            }
        }
    }

    return visited[len - 1];
}

// Greedy version, O(1) space

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