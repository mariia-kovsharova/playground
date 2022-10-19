import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';

export function sumRootToLeaf(root: BinaryTree<1 | 0> | null): number {
    let sum = 0;

    const inner = (tree: BinaryTree<1 | 0> | null, current: number = 0): void => {
        if (!tree) {
            return;
        }

        current = (current << 1) | tree.value;

        if (!tree.left && !tree.right) {
            sum += current;
            return;
        }

        inner(tree.left, current);
        inner(tree.right, current);
    }

    inner(root);

    return sum;
}