import { OrderedSet } from './ordered-set';

describe('Ordered Set', () => {
    let set: OrderedSet<number>;

    beforeEach(() => {
        set = new OrderedSet();
    });

    test('add values to set', () => {
        expect(set.size).toBe(0);

        set.add(2).add(3).add(1);

        expect(set.size).toBe(3);
        expect(set.toString()).toBe('1,2,3');

        set.add(1);
        expect(set.size).toBe(3);
        expect(set.toString()).toBe('1,2,3');

        set.add(6);
        expect(set.size).toBe(4);
        expect(set.toString()).toBe('1,2,3,6');

        set.add(5);
        expect(set.size).toBe(5);
        expect(set.toString()).toBe('1,2,3,5,6');

        set.add(7);
        expect(set.size).toBe(6);
        expect(set.toString()).toBe('1,2,3,5,6,7');

        set.add(4);
        expect(set.size).toBe(7);
        expect(set.toString()).toBe('1,2,3,4,5,6,7');
    })

    test('delete values from set', () => {
        expect(set.size).toBe(0);

        set.add(5).add(2);

        expect(set.size).toBe(2);

        set.delete(3);

        expect(set.size).toBe(2);

        set.delete(5);
        expect(set.size).toBe(1);
        expect(set.toString()).toBe('2');

        set.add(1);
        expect(set.size).toBe(2);
        expect(set.toString()).toBe('1,2');

        set.delete(1).delete(2);
        expect(set.size).toBe(0);
        expect(set.toString()).toBe('');
    })

    test('union of 1 set', () => {
        set.add(1).add(2).add(3);

        expect(OrderedSet.union(set)).toEqual(set);
    })

    test('union of 2 sets', () => {
        const set1 = new OrderedSet([1, 2, 3]);
        const set2 = new OrderedSet([3, 4, 5]);

        const resultSet = new OrderedSet([1, 2, 3, 4, 5]);
        expect(OrderedSet.union(set1, set2)).toEqual(resultSet);
    })

    test('union of 4 sets', () => {
        const set1 = new OrderedSet([1, 2, 3]);
        const set2 = new OrderedSet([3, 4, 5]);
        const set3 = new OrderedSet([6, 7]);
        const set4 = new OrderedSet([8, 9, 10]);

        const resultSet = new OrderedSet([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(OrderedSet.union(set1, set2, set3, set4)).toEqual(resultSet)
    })

    test('intersection of 1 set', () => {
        set.add(1).add(2).add(3);

        expect(OrderedSet.intersection(set)).toEqual(set);
    })

    test('intersection of 2 sets', () => {
        const set1 = new OrderedSet([1, 2, 3]);
        const set2 = new OrderedSet([3, 4, 5]);

        const resultSet = new OrderedSet([3]);
        expect(OrderedSet.intersection(set1, set2)).toEqual(resultSet);
    })

    test('intersection of 4 sets', () => {
        const set1 = new OrderedSet([1, 2, 3]);
        const set2 = new OrderedSet([3, 4, 5]);
        const set3 = new OrderedSet([4, 7, 3]);
        const set4 = new OrderedSet([8, 9, 10, 3]);

        const resultSet = new OrderedSet([3]);
        expect(OrderedSet.intersection(set1, set2, set3, set4)).toEqual(resultSet)
    })

});