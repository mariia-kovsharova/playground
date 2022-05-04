import { LinkedList } from '../list/linked-list/linked-list';

/**
 * Если очередь реализована на связном списке,
 * сложность всех операций - O(1).
 * 
 * Если очередь реализована на массиве, сложность
 * операций равна сложности аналогичной операции на массиве.
 * 
 * Реализация приоритетней на связном списке.
 */
class Queue<T> {
    private readonly queue: LinkedList<T>;

    constructor(private readonly maxSize?: number) {
        this.queue = new LinkedList();
    }

    public get size(): number {
        return this.queue.size;
    }

    public isEmpty(): boolean {
        return this.queue.size === 0;
    }

    public enqueue(value: T): void {
        if (this.maxSize && this.queue.size >= this.maxSize) {
            return;
        }

        this.queue.append(value);
    }

    public dequeue(): T | null {
        return this.queue.deleteHead();
    }

    public peek(): T | null {
        return this.queue.getTail();
    }

}

export { Queue };