import { generateBrackets } from './generate-brackets';

describe('Generate brackets', () => {

    test('2 pairs brackets', () => {
        const result = '(()),()()';
        expect(generateBrackets(2)).toBe(result);
    });

    test('3 pairs brackets', () => {
        const result = '((())),(()()),(())(),()(()),()()()';
        expect(generateBrackets(3)).toBe(result);
    });

    test('0 pairs brackets', () => {
        const result = '';
        expect(generateBrackets(0)).toBe(result);
    });
});
