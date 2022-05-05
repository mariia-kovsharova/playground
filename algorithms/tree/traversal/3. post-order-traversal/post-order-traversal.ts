import { Stack } from '../../../../data-structures/stack/stack';
import { BinaryTree } from '../../../../data-structures/tree/binary-tree/binary-tree';

export const postorderTraversal = <T>(tree: BinaryTree<T> | null): (T | null)[] => {
    if (!tree) {
        return [];
    }

    return [...postorderTraversal(tree.left), ...postorderTraversal(tree.right), tree.value];
};

export const postorderTraversalIterative = <T>(tree: BinaryTree<T> | null): (T | null)[] => {
    const result: (T | null)[] = [];

    if (!tree) {
        return result;
    }

    const stack = new Stack<BinaryTree<T>>();

    // root element has to be the last element in stack (to process last)
    let current: BinaryTree<T> | null = tree;
    let lastVisited: BinaryTree<T> | null = null;

    while (!stack.isEmpty() || current !== null) {
        if (current !== null) {
            stack.push(current);
            current = current.left;

            continue;
        }

        const element = stack.peek();
        // if right child exists and we came from left
        if (element.right && lastVisited !== element.right) {
            current = element.right;
        } else {
            result.push(element.value);
            lastVisited = stack.pop();
        }
    }

    return result;
}