import { exist } from './word-exist';

describe('Word exist in matrix', () => {
    test('matrix [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], search "ABCCED"', () => {
        const matrix = [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]];
        const word = "ABCCED";
        expect(exist(matrix, word)).toBeTruthy();
    });

    test('matrix [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], search "SEE"', () => {
        const matrix = [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]];
        const word = "SEE";
        expect(exist(matrix, word)).toBeTruthy();
    });

    test('matrix [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], search "SEE"', () => {
        const matrix = [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]];
        const word = "ABCB";
        expect(exist(matrix, word)).toBeFalsy();
    });
})