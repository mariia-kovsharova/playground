import { LinkedList } from './linked-list';

describe('LinkedList', () => {
    let list: LinkedList<number>;

    beforeEach(() => {
        list = new LinkedList<number>();
    });

    test('append values', () => {
        list.append(1).append(2).append(3);

        expect(list.toString()).toBe('1,2,3');
        expect(list.size).toBe(3);

        list.append(4, 2);

        expect(list.toString()).toBe('1,2,4,3');
        expect(list.size).toBe(4);

        list.append(5, 0);

        expect(list.toString()).toBe('5,1,2,4,3');
        expect(list.size).toBe(5);

        list.append(6, 5);

        expect(list.toString()).toBe('5,1,2,4,3,6');
        expect(list.size).toBe(6);

        list.append(7, 4);

        expect(list.toString()).toBe('5,1,2,4,7,3,6');
        expect(list.size).toBe(7);
    });

    test('prepend values', () => {
        list.prepend(1).prepend(2).prepend(3);

        expect(list.toString() === '3,2,1');
        expect(list.size === 3);

        list.prepend(0);

        expect(list.toString() === '0,3,2,1');
        expect(list.size === 4);
    });

    test('delete values', () => {
        const stringList = new LinkedList<string>();

        stringList
            .append('foo').append('bar').append('baz')
            .append('foo').append('boo');

        expect(stringList.toString()).toBe('foo,bar,baz,foo,boo');

        stringList.delete('foo');

        expect(stringList.toString()).toBe('bar,baz,boo');

        const anotherList = new LinkedList<string>();

        expect(anotherList.toString()).toBe('');

        anotherList.delete('baz');

        expect(anotherList.toString()).toBe('');

        anotherList.append('baz');

        expect(anotherList.toString()).toBe('baz');

        anotherList.delete('baz');

        expect(anotherList.toString()).toBe('');
    });

    test('delete head', () => {
        const head1 = list.deleteHead();

        expect(head1).toBeNull();

        list.append(1);
        list.append(2);

        const head2 = list.deleteHead();

        expect(head2).toBe(1);

        const head3 = list.deleteHead();

        expect(head3).toBe(2);

        const head4 = list.deleteHead();

        expect(head4).toBeNull();
    });

    test('delete tail', () => {
        const tail1 = list.deleteTail();

        expect(tail1).toBeNull();

        list.append(1);
        list.append(2);

        const tail2 = list.deleteTail();

        expect(tail2).toBe(2);

        const tail3 = list.deleteTail();

        expect(tail3).toBe(1);

        const tail4 = list.deleteTail();

        expect(tail4).toBeNull();
    });

    test('to array', () => {
        list.append(1).append(2).append(3).prepend(4);

        expect(list.toArray()).toEqual([4, 1, 2, 3]);
    });

    test('from array', () => {
        const array = [5, 2, 1, 9];
        list.fromArray(array);

        expect(list.toArray()).toEqual(array);
    });

    test('reverse', () => {
        list.append(1).append(2).append(3).append(4).append(5);

        expect(list.toString()).toBe('1,2,3,4,5');
        expect(list.size).toBe(5);

        list.reverse();

        expect(list.toString()).toBe('5,4,3,2,1');
        expect(list.size).toBe(5);
    });
});
