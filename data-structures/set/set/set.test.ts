import { Set } from './set';

describe('Set', () => {
    let set: Set<number>;

    beforeEach(() => {
        set = new Set();
    });

    test('add values to set', () => {
        expect(set.size).toBe(0);

        set.add(1).add(2).add(3);

        expect(set.size).toBe(3);
        expect(set.toString()).toBe('1,2,3');

        set.add(1);
        expect(set.size).toBe(3);
        expect(set.toString()).toBe('1,2,3');
    })

    test('delete values from set', () => {
        expect(set.size).toBe(0);

        set.add(1).add(2);

        expect(set.size).toBe(2);

        set.delete(3);

        expect(set.size).toBe(2);

        set.delete(1);
        expect(set.size).toBe(1);
        expect(set.toString()).toBe('2');

        set.delete(2);
        expect(set.size).toBe(0);
    })

    test('union of 1 set', () => {
        set.add(1).add(2).add(3);

        expect(Set.union(set)).toEqual(set);
    })

    test('union of 2 sets', () => {
        const set1 = new Set([1, 2, 3]);
        const set2 = new Set([3, 4, 5]);

        const resultSet = new Set([1, 2, 3, 4, 5]);
        expect(Set.union(set1, set2)).toEqual(resultSet);
    })

    test('union of 4 sets', () => {
        const set1 = new Set([1, 2, 3]);
        const set2 = new Set([3, 4, 5]);
        const set3 = new Set([6, 7]);
        const set4 = new Set([8, 9, 10]);

        const resultSet = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(Set.union(set1, set2, set3, set4)).toEqual(resultSet)
    })

    test('intersection of 1 set', () => {
        set.add(1).add(2).add(3);

        expect(Set.intersection(set)).toEqual(set);
    })

    test('intersection of 2 sets', () => {
        const set1 = new Set([1, 2, 3]);
        const set2 = new Set([3, 4, 5]);

        const resultSet = new Set([3]);
        expect(Set.intersection(set1, set2)).toEqual(resultSet);
    })

    test('intersection of 4 sets', () => {
        const set1 = new Set([1, 2, 3]);
        const set2 = new Set([3, 4, 5]);
        const set3 = new Set([4, 7, 3]);
        const set4 = new Set([8, 9, 10, 3]);

        const resultSet = new Set([3]);
        expect(Set.intersection(set1, set2, set3, set4)).toEqual(resultSet)
    })

});