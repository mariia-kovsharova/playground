import { Stack } from '../../../../data-structures/stack/stack';
import { BinaryTree } from '../../../../data-structures/tree/binary-tree/binary-tree';

export const preOrderTraversal = <T>(tree: BinaryTree<T> | null): (T | null)[] => {
    if (!tree) {
        return [];
    }

    const left = preOrderTraversal(tree.left);
    const right = preOrderTraversal(tree.right);

    return [tree.value, ...left, ...right];
}

export const preOrderTraversalIterative = <T>(tree: BinaryTree<T> | null): (T | null)[] => {
    const result: (T | null)[] = [];

    if (!tree) {
        return result;
    }

    const stack = new Stack<BinaryTree<T>>();
    stack.push(tree);

    while (!stack.isEmpty()) {
        const element = stack.pop();
        // first visit current node
        result.push(element.value);
        // then if element has right children, put them to the stack (they will be processed after left children)
        element.right && stack.push(element.right);
        // then put the left child to the top of the stack (to process it firstly)
        element.left && stack.push(element.left);
    }

    return result;
}