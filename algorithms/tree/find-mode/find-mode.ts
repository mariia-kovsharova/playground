import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';

export function findMode(root: BinaryTree | null): number[] {
    if (!root) {
        return [];
    }

    let max: number[] = [];
    let maxCount = 0;
    let prev: number | null = null;
    let currentCount = 0;

    const dfs = (node: BinaryTree | null): void => {
        if (!node) {
            return;
        }

        dfs(node.left);

        currentCount = node.value === prev ? currentCount + 1 : 1;

        if (currentCount > maxCount) {
            max = [node.value];
            maxCount = currentCount;
        } else if (currentCount === maxCount) {
            max.push(node.value);
        }

        prev = node.value;

        dfs(node.right);
    }

    dfs(root);

    return max;
}