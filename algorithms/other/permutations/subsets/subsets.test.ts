import { generateSubsets, generateSubsetsBacktracking } from './subsets';

describe('Generate subsets without repeats', () => {
    test('subset for input [0]', () => {
        const input = [0];

        const result = [[], [0]];

        const expected = generateSubsets(input);
        const expectedBacktracking = generateSubsetsBacktracking(input);

        expect(expected.length).toBe(result.length);
        expect(expectedBacktracking.length).toBe(result.length);

        expected.forEach(arr => {
            expect(result).toContainEqual(arr);
        });

        expectedBacktracking.forEach(arr => {
            expect(result).toContainEqual(arr);
        });
    });

    test('subset for input [1, 2]', () => {
        const input = [1, 2];

        const result = [[], [1], [2], [1, 2]];

        const expected = generateSubsets(input);
        const expectedBacktracking = generateSubsetsBacktracking(input);

        expect(expected.length).toBe(result.length);
        expect(expectedBacktracking.length).toBe(result.length);

        expected.forEach(arr => {
            expect(result).toContainEqual(arr);
        });

        expectedBacktracking.forEach(arr => {
            expect(result).toContainEqual(arr);
        });
    });

    test('subset for input [1, 2, 3]', () => {
        const input = [1, 2, 3];

        const result = [[], [1], [1, 2], [1, 3], [2], [2, 3], [3], [1, 2, 3]];

        const expected = generateSubsets(input);
        const expectedBacktracking = generateSubsetsBacktracking(input);

        expect(expected.length).toBe(result.length);
        expect(expectedBacktracking.length).toBe(result.length);

        expected.forEach(arr => {
            expect(result).toContainEqual(arr);
        });

        expectedBacktracking.forEach(arr => {
            expect(result).toContainEqual(arr);
        });
    });
});
