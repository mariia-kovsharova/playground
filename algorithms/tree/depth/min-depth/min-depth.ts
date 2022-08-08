import { BinaryTree } from '../../../../data-structures/tree/binary-tree/binary-tree';

export function minDepthDfs(root: BinaryTree | null): number {
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

        if (!tree.left) {
            return 1 + dfs(tree.right);
        }

        if (!tree.right) {
            return 1 + dfs(tree.left);
        }

        return 1 + Math.min(dfs(tree.left), dfs(tree.right));
    }

    return dfs(root);
}

export function minDepthBfs(root: BinaryTree | null): number {
    if (!root) {
        return 0;
    }

    const queue: Array<BinaryTree> = [root];
    let depth = 0;

    while (queue.length) {
        const node = queue.shift() as BinaryTree;
        depth += 1;

        if (node.left === null && node.right === null) {
            break;
        }

        if (node.left) {
            queue.push(node.left);
        }

        if (node.right) {
            queue.push(node.right);
        }
    }

    return depth;
}