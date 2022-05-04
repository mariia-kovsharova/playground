import { Queue } from '../../../data-structures/queue/queue';
import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';

export const bfs = <T>(tree: BinaryTree<T>, target: T): boolean => {
    const queue = new Queue<BinaryTree<T>>();
    queue.enqueue(tree);

    while (!queue.isEmpty()) {
        const element = queue.dequeue();

        if (element!.value === target) {
            return true;
        }

        if (element!.left) {
            queue.enqueue(element!.left);
        }

        if (element!.right) {
            queue.enqueue(element!.right);
        }
    }

    return false;
}