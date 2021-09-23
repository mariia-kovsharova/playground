import { BinaryTree } from './binary-tree';

describe('Binary Tree', () => {
    let tree: BinaryTree<number>;

    beforeEach(() => {
        tree = new BinaryTree();
    });

    test('Only left side tree', () => {
        /**|
         * |        8
         * |      6
         * |    5
         * |  2
         * |1   
         */
        tree.add(8);
        tree.add(6);
        tree.add(5);
        tree.add(2);
        tree.add(1);

        const traversal = tree.traversal();

        expect(traversal).toEqual([1, 2, 5, 6, 8]);
    });

    test('Left side tree with last right node', () => {
        /**|
         * |        8
         * |      6
         * |    5
         * |  2
         * |    3   
         */

        tree.add(8);
        tree.add(6);
        tree.add(5);
        tree.add(2);
        tree.add(3);

        const traversal = tree.traversal();

        expect(traversal).toEqual([2, 3, 5, 6, 8]);
    });

    test('Both side tree', () => {
        /**|
         * |          8
         * |      5       9
         * |    3   6  10   12
         * |  2   4            14
         *                        20
         * |   
         */

        tree.add(8);
        tree.add(5);
        tree.add(9);
        tree.add(12);
        tree.add(14);
        tree.add(10);
        tree.add(6);
        tree.add(3);
        tree.add(2);
        tree.add(4);
        tree.add(20);

        expect(tree.leftHeight()).toBe(3);
        expect(tree.rightHeight()).toBe(4);
        expect(tree.height()).toBe(8);

        const traversal = tree.traversal();

        expect(traversal).toEqual([2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 20]);
    });
})