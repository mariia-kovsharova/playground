import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree'
import { sumRootToLeaf } from './sum-root-to-leaf'

describe('Sum of binary tree from 0 and 1', () => {
    test('[1,0,1,0,1,0,1] tree should be 22', () => {
        /**
         *       1
         *    0     1
         *   0 1   0 1
         */
        const tree = new BinaryTree<1 | 0>(
            1,
            new BinaryTree(
                0,
                new BinaryTree(0),
                new BinaryTree(1),
            ),
            new BinaryTree(
                1,
                new BinaryTree(0),
                new BinaryTree(1)
            )
        )

        expect(sumRootToLeaf(tree)).toBe(22);
    })
})