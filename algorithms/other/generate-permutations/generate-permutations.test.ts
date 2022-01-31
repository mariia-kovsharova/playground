import { generatePermutations } from './generate-permutations';

describe('Generate permutations', () => {
    test('generate sequence with numeric system 3 and length 3', () => {
        const result = ['123', '132', '213', '231', '312', '321'];
        expect(generatePermutations(3)).toEqual(result);
    });
});
