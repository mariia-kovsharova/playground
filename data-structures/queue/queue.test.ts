import { Queue } from './queue';

describe('Queue', () => {
    let queue: Queue<number>;

    beforeEach(() => {
        queue = new Queue();
    });

    test('enqueue', () => {
        expect(queue.size).toBe(0);
        expect(queue.isEmpty()).toBeTruthy();

        queue.enqueue(1);
        queue.enqueue(2);

        expect(queue.size).toBe(2);
        expect(queue.isEmpty()).toBeFalsy();
    });

    test('denqueue', () => {
        expect(queue.size).toBe(0);
        expect(queue.isEmpty()).toBeTruthy();

        queue.enqueue(1);
        queue.enqueue(2);

        expect(queue.size).toBe(2);
        expect(queue.isEmpty()).toBeFalsy();

        const first = queue.dequeue();

        expect(first).toBe(1);
        expect(queue.size).toBe(1);

        const second = queue.dequeue();

        expect(second).toBe(2);
        expect(queue.size).toBe(0);
        expect(queue.isEmpty()).toBeTruthy();

        const third = queue.dequeue();

        expect(third).toBeNull();
    });

    test('peek', () => {
        queue.enqueue(9);
        queue.enqueue(10);

        expect(queue.size).toBe(2);

        const value = queue.peek();

        expect(value).toBe(10);
        expect(queue.size).toBe(2);
    })
});