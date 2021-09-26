class MaxHeap<T> {
    private readonly heap: Array<T>;
    private _size: number;

    constructor() {
        this.heap = [];
        this._size = 0;
    }

    get size(): number {
        return this._size;
    }

    public push(value: T): void {
        this.heap.push(value);

        let currentIndex = this.heap.length - 1;
        let parentIndex = this.getParentElementIndex(currentIndex);

        while (currentIndex > 1 && this.heap[parentIndex] > value) {

        }
    }

    private pullUp(): void {

    }

    private pullDown(): void { }

    private getParentElementIndex(i: number): number {
        return Math.floor(i / 2);
    }

    private getLeftChildIndex(i: number): number {
        return 2 * i + 1;
    }

    private getRightChildIndex(i: number): number {
        return 2 * i + 2;
    }
}