import { Stack } from '../../../data-structures/stack/stack';
import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';

/**
 * 
 * You are given an integer array nums with no duplicates. A maximum binary tree can be built recursively from nums using the following algorithm:
 * Create a root node whose value is the maximum value in nums.
 * Recursively build the left subtree on the subarray prefix to the left of the maximum value.
 * Recursively build the right subtree on the subarray suffix to the right of the maximum value.
 * Return the maximum binary tree built from nums.
 * 
 * Input: nums = [3,2,1,6,0,5]
 * Output: [6,3,5,null,2,0,null,null,1]
 * 
 *           6
 *       3       5
 *        2     0
 *         1    
 */

export function constructMaximumBinaryTree(nums: number[]): BinaryTree | null {
    const size = nums.length;

    if (!size) {
        return null;
    }

    const stack = new Stack<BinaryTree>();

    for (let pointer = 0; pointer < size; pointer += 1) {
        const node = new BinaryTree(nums[pointer]);

        while (!stack.isEmpty() && stack.peek().value < nums[pointer]) {
            const top = stack.pop();
            node.left = top;
        }

        if (!stack.isEmpty()) {
            stack.peek().right = node;
        }

        stack.push(node);
    }

    return stack[0];
};