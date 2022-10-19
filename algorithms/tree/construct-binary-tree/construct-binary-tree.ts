import { Stack } from '../../../data-structures/stack/stack';
import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';

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

    return stack.first();
}