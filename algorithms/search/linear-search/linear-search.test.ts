import { linearSearch } from './linear-search';

describe('LinearSearch', () => {
    const array = [20, 12, 3, 53, 13, 1, 14, 8, 2, 19];

    test('search element "53"', () => {
        expect(linearSearch(array, 53)).toBe(3);
    });

    test('search non-existing element', () => {
        expect(linearSearch(array, 42)).toBeNull();
    });
});