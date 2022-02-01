import { generatePermutationsWithoutRepeats } from './permutations-without-repeats';

describe('Generate permutations without repeats', () => {
    test('generate sequence with numeric system 3 and length 3', () => {
        const result = ['123', '132', '213', '231', '312', '321'];
        expect(generatePermutationsWithoutRepeats(3)).toEqual(result);
    });

    test('generate sequence with numeric system 5 and length 2', () => {
        const result = [
            '12', '13', '14', '15',
            '21', '23', '24', '25',
            '31', '32', '34', '35',
            '41', '42', '43', '45',
            '51', '52', '53', '54'
        ];
        expect(generatePermutationsWithoutRepeats(5, 2)).toEqual(result);
    });
});
