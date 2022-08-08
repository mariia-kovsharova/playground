import { BinaryTree } from '../../../../data-structures/tree/binary-tree/binary-tree';

export function maxDepthDfs(root: BinaryTree | null): number {
    if (!root) {
        return 0;
    }

    const dfs = (tree: BinaryTree | null): number => {
        if (!tree) {
            return 0;
        }

        if (!tree.left && !tree.right) {
            return 1;
        }

        return 1 + Math.max(dfs(tree.left), dfs(tree.right));
    }

    return dfs(root);
}