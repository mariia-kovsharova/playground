import { decodeString } from './decode-string';

describe('Decode string', () => {

    test('Decode "3[a2[c]]"', () => {
        const data = "3[a2[c]]";
        const result = "accaccacc";
        expect(decodeString(data)).toBe(result);
    });

    test('Decode "3[a]2[bc]"', () => {
        const data = "3[a]2[bc]";
        const result = 'aaabcbc';
        expect(decodeString(data)).toBe(result);
    });

    test('Decode "2[abc]3[cd]ef"', () => {
        const data = "2[abc]3[cd]ef";
        const result = 'abcabccdcdcdef';
        expect(decodeString(data)).toBe(result);
    });

    test('Decode "12[a]"', () => {
        const data = "12[a]";
        const result = 'aaaaaaaaaaaa';
        expect(decodeString(data)).toBe(result);
    });
});
