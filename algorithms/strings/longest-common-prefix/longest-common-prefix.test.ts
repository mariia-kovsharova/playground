import { longestCommonPrefix } from './longest-common-prefix';

describe('Longest common prefix', () => {
    test('in group ["flower","flow","flight"] it should be "fl"', () => {
        expect(longestCommonPrefix(["flower", "flow", "flight"])).toBe('fl');
    });

    test('in group ["dog","racecar","car"] it should be empty', () => {
        expect(longestCommonPrefix(["dog", "racecar", "car"])).toBe('');
    });
})