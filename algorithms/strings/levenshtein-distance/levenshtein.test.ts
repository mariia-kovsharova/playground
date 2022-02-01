import { levenshteinDistance } from './levenshtein';

describe('Levenshtein distance', () => {
    test('distance between "kitten" and "sitten" has to be 1', () => {
        expect(levenshteinDistance('kitten', 'sitten')).toBe(1);
    });

    test('distance between "saturday" and "sunday" has to be 3', () => {
        expect(levenshteinDistance('saturday', 'sunday')).toBe(3);
    });
})