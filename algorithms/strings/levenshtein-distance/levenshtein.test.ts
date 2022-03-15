import { levenshteinDistance } from './levenshtein';

describe('Levenshtein distance', () => {
    test('distance between "kitten" and "sitten" has to be 1', () => {
        expect(levenshteinDistance('kitten', 'sitten')).toBe(1);
    });

    test('distance between "saturday" and "sunday" has to be 3', () => {
        expect(levenshteinDistance('saturday', 'sunday')).toBe(3);
    });

    test('distance between "football" and "ball" has to be 4', () => {
        expect(levenshteinDistance('football', 'ball')).toBe(4);
    });

    test('distance between "test" and "forest" has to be 3', () => {
        expect(levenshteinDistance('test', 'forest')).toBe(3);
    });
})