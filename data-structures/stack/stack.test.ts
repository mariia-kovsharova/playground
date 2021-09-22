import { Stack } from './stack';

describe('Stack', () => {
    let stack: Stack<number>;

    beforeEach(() => {
        stack = new Stack();
    });

    test('push', () => {
        expect(stack.isEmpty()).toBeTruthy();
        expect(stack.size).toBe(0);

        stack.push(1);
        stack.push(5);

        expect(stack.isEmpty()).toBeFalsy();
        expect(stack.size).toBe(2);
        expect(stack.peek()).toBe(5);
    });

    test('pop', () => {
        expect(() => stack.pop()).toThrowError('Can not pop from empty stack');
        expect(stack.isEmpty()).toBeTruthy();

        stack.push(9);

        expect(stack.isEmpty()).toBeFalsy();

        const popped = stack.pop();

        expect(popped).toBe(9);
        expect(stack.isEmpty()).toBeTruthy();
    });

    test('peek', () => {
        expect(() => stack.peek()).toThrowError('Can not get top from empty stack');
        expect(stack.isEmpty()).toBeTruthy();

        stack.push(10);

        expect(stack.isEmpty()).toBeFalsy();

        const top = stack.peek();

        expect(top).toBe(10);
        expect(stack.isEmpty()).toBeFalsy();
    });
});