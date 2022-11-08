import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree';
import { recoverFromPreorder } from './tree-from-preorder';

describe('Tree from preorder', () => {
    it('Tree "1-2--3--4-5--6--7"', () => {
        const preorder = '1-2--3--4-5--6--7';

        const tree = new BinaryTree(
            1,
            new BinaryTree(2, new BinaryTree(3), new BinaryTree(4)),
            new BinaryTree(5, new BinaryTree(6), new BinaryTree(7))
        );

        expect(recoverFromPreorder(preorder)).toEqual(tree);
    });

    it('Tree "1-2--3---4-5--6---7"', () => {
        const preorder = '1-2--3---4-5--6---7';

        const tree = new BinaryTree(
            1,
            new BinaryTree(2, new BinaryTree(3, new BinaryTree(4))),
            new BinaryTree(5, new BinaryTree(6, new BinaryTree(7)))
        );

        expect(recoverFromPreorder(preorder)).toEqual(tree);
    });

    it('Tree "1-401--349---90--88"', () => {
        const preorder = '1-401--349---90--88';

        const tree = new BinaryTree(
            1,
            new BinaryTree(401, new BinaryTree(349, new BinaryTree(90)), new BinaryTree(88))
        );

        expect(recoverFromPreorder(preorder)).toEqual(tree);
    });
});
