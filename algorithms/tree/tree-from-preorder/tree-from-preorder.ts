/**
 *
 * We run a preorder depth-first search (DFS) on the root of a binary tree.
 *
 * At each node in this traversal, we output D dashes (where D is the depth of this node),
 * then we output the value of this node.  If the depth of a node is D, the depth of its immediate child is D + 1.
 *
 * The depth of the root node is 0.
 *
 * If a node has only one child, that child is guaranteed to be the left child.
 * Given the output traversal of this traversal, recover the tree and return its root.
 */

import { Stack } from '../../../data-structures/stack/stack';
import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';

export function recoverFromPreorder(traversal: string): BinaryTree | null {
    const stack = new Stack();
    const dash = '-';

    let pointer = 0;

    while (pointer < traversal.length) {
        let value;
        let level;

        for (level = 0; traversal[pointer] === dash; pointer += 1) {
            level += 1;
        }

        for (value = 0; pointer < traversal.length && traversal[pointer] !== dash; pointer += 1) {
            value = value * 10 + +traversal[pointer];
        }

        const node = new BinaryTree(value);

        while (stack.size > level) {
            stack.pop();
        }

        if (!stack.isEmpty()) {
            const parent = stack.peek();

            if (parent.left === null) {
                parent.left = node;
            } else {
                parent.right = node;
            }
        }

        stack.push(node);
    }

    while (stack.size > 1) {
        stack.pop();
    }

    return stack.isEmpty() ? null : stack.peek();
}

function recoverFromPreorderReg(traversal: string): BinaryTree | null {
    const dfs = (str: string, level: number): BinaryTree | null => {
        if (!str.length) {
            return null;
        }

        const reg = new RegExp(`(?<=\\d-{${level}})\\d`, 'g');
        const [left, right] = [...str.matchAll(reg)].map((match) => match.index);

        const endOfLeft = right ? right - level : str.length;

        const leftTree = left ? dfs(str.slice(left, endOfLeft), level + 1) : null;
        const rightTree = right ? dfs(str.slice(right), level + 1) : null;

        const value = str.slice(0, left ? left - level : str.length);

        return new BinaryTree(+value, leftTree, rightTree);
    };

    return dfs(traversal, 1);
}
