import { Stack } from '../../../data-structures/stack/stack';
import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';

export function bstFromPreorder(preorder: number[]): BinaryTree | null {
    if (!preorder.length) {
        return null;
    }

    const root = new BinaryTree(preorder[0]);
    const stack = new Stack<BinaryTree>();
    stack.push(root);

    for (let i = 1; i < preorder.length; i += 1) {
        const node = new BinaryTree(preorder[i]);

        if (preorder[i] < stack.peek().value) {
            // console.log('item is less then last stack element');
            stack.peek().left = node;
        } else {
            // console.log('item is more them last stack element');
            let last: BinaryTree;

            // finaly the last element is root or the closest right element 
            while (!stack.isEmpty() && stack.peek().value < preorder[i]) {
                last = stack.pop();
            }

            last!.right = node;
        }

        stack.push(node);
    }

    return root;
}