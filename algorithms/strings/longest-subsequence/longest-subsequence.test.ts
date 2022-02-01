import { findLongestSubsequance } from './longest-subsequence';

describe('Find longest subsequence between two words', () => {
    test('Longest subsequence between "fish" and "fosh" has to be 3', () => {
        expect(findLongestSubsequance('fish', 'fosh')).toBe(3);
    });

    test('Longest subsequence between "fish" and "vista" has to be 2', () => {
        expect(findLongestSubsequance('fish', 'vista')).toBe(2);
    });

    test('Longest subsequence between "forest" and "clue" has to be 1', () => {
        expect(findLongestSubsequance('forest', 'clue')).toBe(1);
    });

    test('Longest subsequence between "test" and "tishes" has to be 3', () => {
        expect(findLongestSubsequance('test', 'tishes')).toBe(3);
    });

    test('Longest subsequence between "test" and "bullet" has to be 2', () => {
        expect(findLongestSubsequance('test', 'bullet')).toBe(2);
    });
});
