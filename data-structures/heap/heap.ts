abstract class Heap<T> {
    private readonly heap: Array<T>;

    constructor() {
        this.heap = [];
    }

    protected abstract compare(a: T, b: T): boolean;

    get size(): number {
        return this.heap.length;
    }

    public add(value: T): void {
        this.heap.push(value);

        let currentIndex: number | null = this.heap.length - 1;

        while (currentIndex && currentIndex > 0) {
            currentIndex = this.pullUp(currentIndex);
        }
    }

    public poll(): T | null {
        if (!this.heap.length) {
            return null;
        }

        const first = this.heap.shift() as NonNullable<T>;

        if (this.heap.length) {
            const last = this.heap.pop() as NonNullable<T>;
            this.heap.unshift(last);

            let currentIndex: number | null = 0;

            while (currentIndex !== null) {
                currentIndex = this.pullDown(currentIndex);
            }
        }

        return first;
    }

    public peek(): T | null {
        return this.heap[0] ?? null;
    }

    public toString(): string {
        return this.heap.toString();
    }

    public isEmpty(): boolean {
        return !this.heap.length;
    }

    private pullUp(currentIndex: number): number | null {
        const parentIndex = this.getParentElementIndex(currentIndex);

        if (this.compare(this.heap[parentIndex], this.heap[currentIndex])) {
            return null;
        }

        [this.heap[parentIndex], this.heap[currentIndex]] = [this.heap[currentIndex], this.heap[parentIndex]];
        return parentIndex;
    }

    private pullDown(currentIndex: number): number | null {
        const leftChildIndex = this.getLeftChildIndex(currentIndex);
        const rightChildIndex = this.getRightChildIndex(currentIndex);

        // Если есть оба потомка, необходимо понять, с каким именно менять текущий эл-т
        if (this.hasLeftChild(leftChildIndex) && this.hasRightChild(rightChildIndex)) {
            // Если левый элемент больше/меньше правого, тогда обмениваем текущий
            // с левым, иначе - наоборот
            if (this.compare(this.heap[leftChildIndex], this.heap[rightChildIndex])) {
                [this.heap[currentIndex], this.heap[leftChildIndex]] = [this.heap[leftChildIndex], this.heap[currentIndex]];
                return leftChildIndex;
            } else {
                [this.heap[currentIndex], this.heap[rightChildIndex]] = [this.heap[rightChildIndex], this.heap[currentIndex]];
                return rightChildIndex;
            }
        }

        if (this.hasLeftChild(leftChildIndex) &&
            this.compare(this.heap[leftChildIndex], this.heap[currentIndex])) {
            [this.heap[currentIndex], this.heap[leftChildIndex]] = [this.heap[leftChildIndex], this.heap[currentIndex]];
            return leftChildIndex;
        }

        if (this.hasRightChild(rightChildIndex) &&
            this.compare(this.heap[rightChildIndex], this.heap[currentIndex])) {
            [this.heap[currentIndex], this.heap[rightChildIndex]] = [this.heap[rightChildIndex], this.heap[currentIndex]];
            return rightChildIndex;
        }

        return null;
    }

    private getParentElementIndex(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    private getLeftChildIndex(i: number): number {
        return 2 * i + 1;
    }

    private hasLeftChild(childIndex: number): boolean {
        return !!(this.heap[childIndex] ?? false);
    }

    private getRightChildIndex(i: number): number {
        return 2 * i + 2;
    }

    private hasRightChild(childIndex: number): boolean {
        return !!(this.heap[childIndex] ?? false);
    }
}

export { Heap };