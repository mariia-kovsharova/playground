import { BinaryTree } from '../../../data-structures/tree/binary-tree/binary-tree'
import { bfs } from './breadth-first-search';

describe('Breadth-first search', () => {
    describe('Check existing the name', () => {
        let tree: BinaryTree<string>;

        beforeAll(() => {
            tree = new BinaryTree(
                'Martha',
                new BinaryTree(
                    'Alex',
                    new BinaryTree(
                        'Bob',
                        new BinaryTree('Lukas'),
                        null
                    ),
                    new BinaryTree(
                        null,
                        new BinaryTree('Keith')
                    ),
                ),
                new BinaryTree(
                    'Isaac',
                    null,
                    new BinaryTree(
                        'Brithney',
                        new BinaryTree(
                            'Christina',
                            new BinaryTree('Joy'),
                            new BinaryTree('Alexandra')
                        ),
                        null
                    )
                ),
            )
        });

        test('Tree has name Christina', () => {
            const result = bfs(tree, 'Christina');
            expect(result).toBeTruthy();
        });

        test('Tree has name Keith', () => {
            const result = bfs(tree, 'Keith');
            expect(result).toBeTruthy();
        });

        test('Tree has not name John', () => {
            const result = bfs(tree, 'John');
            expect(result).toBeFalsy();
        });
    })
})