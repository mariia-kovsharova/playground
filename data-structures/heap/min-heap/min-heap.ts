import { Heap } from '../heap';

class MinHeap<T> extends Heap<T> {
    constructor() {
        super();
    }

    protected compare(a: T, b: T): boolean {
        return a < b;
    }
}

export { MinHeap };