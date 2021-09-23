import { LinkedList } from '../list/linked-list/linked-list';

/**
 * Если стек реализован на связном списке,
 * сложность всех операций - O(1).
 * 
 * Если стек реализован на массиве, сложность
 * операций равна сложности аналогичной операции на массиве.
 * 
 * Реализация приоритетней на связном списке.
 */
class Stack<T = any> {
    private stack: LinkedList<T>;

    constructor() {
        this.stack = new LinkedList<T>();
    }

    get size(): number {
        return this.stack.size;
    }

    public clear(): void {
        this.stack.clear();
    }

    public isEmpty(): boolean {
        return this.stack.size === 0;
    }

    public push(value: T): void {
        this.stack.append(value);
    }

    public pop(): T | never {
        if (this.isEmpty()) {
            throw new Error('Can not pop from empty stack')
        }

        const item = this.stack.deleteTail();
        return item!;
    }

    public peek(): T | never {
        if (this.isEmpty()) {
            throw new Error('Can not get top from empty stack')
        }

        return this.stack.getTail() as NonNullable<T>;
    }

    public print(): string {
        return this.stack.toString();
    }
}

export { Stack }
