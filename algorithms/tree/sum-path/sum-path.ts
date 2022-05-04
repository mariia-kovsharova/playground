import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';

function isLeaf(node: BinaryTree<number>): boolean {
    return !node.left && !node.right;
}

export function hasPathSum(root: BinaryTree<number> | null, targetSum: number): boolean {
    const inner = (node: BinaryTree<number> | null, current: number): boolean => {
        if (!node) {
            return false;
        }

        if (isLeaf(node)) {
            return (current + (node.value ?? 0)) === targetSum;
        }

        return inner(node.left, current + (node.value ?? 0))
            || inner(node.right, current + (node.value ?? 0));
    }

    return inner(root, 0);
}