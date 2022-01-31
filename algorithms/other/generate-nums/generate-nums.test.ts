import { generateNumbers } from './generate-nums';

describe('Generate numbers', () => {
    test('generate binary sequence with length 3', () => {
        const result = ['000', '001', '010', '011', '100', '101', '110', '111'];
        expect(generateNumbers(2, 3)).toEqual(result);
    });

    test('generate binary sequence with length 0', () => {
        const result = [''];
        expect(generateNumbers(2, 0)).toEqual(result);
    });

    test('generate sequence with number system 3 length 3', () => {
        const result = ['000', '001', '002', '010', '011', '012', '020', '021', '022', '100', '101', '102', '110', '111', '112', '120', '121', '122', '200', '201', '202', '210', '211', '212', '220', '221', '222'];
        expect(generateNumbers(3, 3)).toEqual(result);
    });
});
