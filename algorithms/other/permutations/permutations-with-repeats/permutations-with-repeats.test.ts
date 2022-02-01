import { generatePermutationsWithRepeats } from './permutations-with-repeats';

describe('Generate permutations with repeats', () => {
    test('generate binary sequence with length 3', () => {
        const result = ['000', '001', '010', '011', '100', '101', '110', '111'];
        expect(generatePermutationsWithRepeats(2, 3)).toEqual(result);
    });

    test('generate binary sequence with length 0', () => {
        const result = [''];
        expect(generatePermutationsWithRepeats(2, 0)).toEqual(result);
    });

    test('generate sequence with number system 3 length 3', () => {
        const result = ['000', '001', '002', '010', '011', '012', '020', '021', '022', '100', '101', '102', '110', '111', '112', '120', '121', '122', '200', '201', '202', '210', '211', '212', '220', '221', '222'];
        expect(generatePermutationsWithRepeats(3)).toEqual(result);
    });

    test('generate sequence with number system 2 length 5', () => {
        const result = [
            '00000', '00001', '00010', '00011', '00100', '00101', '00110',
            '00111', '01000', '01001', '01010', '01011', '01100', '01101',
            '01110', '01111', '10000', '10001', '10010', '10011', '10100',
            '10101', '10110', '10111', '11000', '11001', '11010', '11011',
            '11100', '11101', '11110', '11111'
        ];
        expect(generatePermutationsWithRepeats(2, 5)).toEqual(result);
    });
});
