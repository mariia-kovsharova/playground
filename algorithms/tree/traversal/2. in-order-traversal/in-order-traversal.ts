import { Stack } from '../../../../data-structures/stack/stack';
import { BinaryTree } from '../../../../data-structures/tree/binary-tree/binary-tree';

export const inOrderTraversal = <T>(tree: BinaryTree<T> | null): (T | null)[] => {
    if (!tree) {
        return [];
    }

    const left = inOrderTraversal(tree.left);
    const right = inOrderTraversal(tree.right);

    return [...left, tree.value, ...right];
}

export const inOrderTraversalIterative = <T>(tree: BinaryTree<T> | null): (T | null)[] => {
    const result: (T | null)[] = [];

    if (!tree) {
        return result;
    }

    const stack = new Stack<BinaryTree<T>>();

    let current: BinaryTree<T> | null = tree;

    while (current !== null || !stack.isEmpty()) {
        // if current element is not the last left child
        if (current !== null) {
            // than we push current element to stack (it will be one previous before last)
            stack.push(current);
            current = current.left;

            continue;
        }

        const last = stack.pop();
        // visit current node
        result.push(last.value);
        // then we have to visit right node
        current = last.right;
    }

    return result;
}