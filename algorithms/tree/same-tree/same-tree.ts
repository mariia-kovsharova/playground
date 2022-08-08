/* eslint-disable @typescript-eslint/no-unused-vars */
import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';

function isSameTreeBfs(p: BinaryTree | null, q: BinaryTree | null): boolean {
    if (!p && !q) {
        return true;
    }

    if (!p || !q) {
        return false;
    }

    const queue: Array<BinaryTree | null> = [p, q];

    while (queue.length > 0) {
        const n1 = queue.shift();
        const n2 = queue.shift();

        if (n1 === null && n2 === null) {
            continue;
        }

        if (!n1 || !n2 || n1.value !== n2.value) {
            return false;
        }

        queue.push(n1.left);
        queue.push(n2.left);
        queue.push(n1.right);
        queue.push(n2.right);
    }

    return true;
}

function isSameTreeDfs(p: BinaryTree | null, q: BinaryTree | null): boolean {
    if (!p && !q) {
        return true;
    }

    if (!p || !q) {
        return false;
    }

    if (p.value !== q.value) {
        return false;
    }

    return isSameTreeDfs(p.left, q.left) && isSameTreeDfs(p.right, q.right);
}