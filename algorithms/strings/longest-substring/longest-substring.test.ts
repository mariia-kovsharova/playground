import { findLongestSubstring } from './longest-substring';

describe('Find longest substring between two words', () => {
    test('Longest substring between "fish" and "fosh" has to be 2', () => {
        expect(findLongestSubstring('fish', 'fosh')).toBe(2);
    });

    test('Longest substring between "fish" and "vista" has to be 2', () => {
        expect(findLongestSubstring('fish', 'vista')).toBe(2);
    });

    test('Longest substring between "blue" and "clues" has to be 3', () => {
        expect(findLongestSubstring('blue', 'clues')).toBe(3);
    });

    test('Longest substring between "test" and "fish" has to be 1', () => {
        expect(findLongestSubstring('test', 'fish')).toBe(1);
    });

    test('Longest substring between "test" and "bullet" has to be 1', () => {
        expect(findLongestSubstring('test', 'bullet')).toBe(1);
    });

    test('Longest substring between "SUBSEQUENCE" and "SUBEUENCS" has to be 4', () => {
        expect(findLongestSubstring('SUBSEQUENCE', 'SUBEUENCS')).toBe(4);
    });
});
