import { BinaryTree } from './binary-tree';

describe('Binary Tree', () => {
    let tree: BinaryTree<number>;

    beforeEach(() => {
        tree = new BinaryTree(8);
    });

    test('Only left side tree', () => {
        /**|
         * |        8
         * |      6
         * |    5
         * |  2
         * |1   
         */
        tree.insert(6);
        tree.insert(5);
        tree.insert(2);
        tree.insert(1);

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
        tree.insert(6);
        tree.insert(5);
        tree.insert(2);
        tree.insert(3);

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
        tree.insert(5);
        tree.insert(9);
        tree.insert(12);
        tree.insert(14);
        tree.insert(10);
        tree.insert(6);
        tree.insert(3);
        tree.insert(2);
        tree.insert(4);
        tree.insert(20);

        expect(tree.leftHeight()).toBe(3);
        expect(tree.rightHeight()).toBe(4);
        expect(tree.height()).toBe(8);

        const traversal = tree.traversal();

        expect(traversal).toEqual([2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 20]);
    });

    test('Check if binary tree is valid', () => {
        const validTree = new BinaryTree(
            5,
            new BinaryTree(
                3,
                new BinaryTree(2),
                new BinaryTree(4)
            ),
            new BinaryTree(
                7,
                new BinaryTree(6)
            )
        )

        const valid = BinaryTree.isValid(validTree, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        expect(valid).toBe(true);

        const invalidTree = new BinaryTree(
            5,
            new BinaryTree(
                4,
                new BinaryTree(2),
                new BinaryTree(3)
            ),
            new BinaryTree(
                7,
                new BinaryTree(6)
            )
        );

        const invalid = BinaryTree.isValid(invalidTree, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        expect(invalid).toBe(false);

        const singleNodeTree = new BinaryTree(2);
        const singleNode = BinaryTree.isValid(singleNodeTree, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        expect(singleNode).toBe(true);

        const nullableTree = BinaryTree.isValid(null, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        expect(nullableTree).toBe(true);
    })

    test('Delete node from tree', () => {
        /**|
         * |          8
         * |      5       9
         * |    3   6  10   12
         * |  2   4            14
         *                        20
         * |   
         */
        tree.insert(5);
        tree.insert(9);
        tree.insert(12);
        tree.insert(14);
        tree.insert(10);
        tree.insert(6);
        tree.insert(3);
        tree.insert(2);
        tree.insert(4);
        tree.insert(20);

        expect(tree.leftHeight()).toBe(3);
        expect(tree.rightHeight()).toBe(4);
        expect(tree.height()).toBe(8);

        expect(tree.traversal()).toEqual([2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 20]);

        tree = BinaryTree.delete(tree, 1)!;
        expect(tree.traversal()).toEqual([2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 20]);

        tree = BinaryTree.delete(tree, 5)!;
        expect(tree.traversal()).toEqual([2, 3, 4, 6, 8, 9, 10, 12, 14, 20]);
    })

    test('Delete single node from tree', () => {
        expect(tree.traversal()).toEqual([8]);
        const result = BinaryTree.delete(tree, 8);
        expect(result).toBe(null);
    })
})