import { constructMaximumBinaryTree } from './construct-binary-tree';

describe('Construct binary tree from nums', () => {
    it('Array [3,2,1,6,0,5]', () => {
        const nums = [3, 2, 1, 6, 0, 5];
        const result = constructMaximumBinaryTree(nums);

        expect(result?.traversal()).toBe(nums);
    })
})