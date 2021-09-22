import { binarySearch, binarySearchRecursive } from './binary-search';

describe('BinarySearch', () => {
    const array = [1, 2, 3, 8, 9, 12, 13, 14, 19, 20, 53];

    test('search element "53"', () => {
        expect(binarySearchRecursive(array, 53)).toBe(10);
        expect(binarySearch(array, 53)).toBe(10);
    });

    test('search element "13"', () => {
        expect(binarySearch(array, 13)).toBe(6);
    });

    test('search element "3"', () => {
        expect(binarySearch(array, 3)).toBe(2);
    });

    test('search element "1"', () => {
        expect(binarySearch(array, 1)).toBe(0);
    });

    test('search element "20"', () => {
        expect(binarySearch(array, 20)).toBe(9);
    });

    test('search non-existing element', () => {
        expect(binarySearch(array, 42)).toBeNull();
    });
});