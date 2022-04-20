class CircularQueue<T> {
    private list: T[];
    private size: number;
    private head: number;
    private tail: number;

    constructor(size: number) {
        this.size = size;
        this.list = Array(size);
        this.head = -1;
        this.tail = -1;
    }

    enqueue(value: T): boolean {
        if (this.isFull()) {
            return false;
        }

        if (this.isEmpty()) {
            this.head = 0;
        }

        this.tail = (this.tail + 1) % this.size;

        this.list[this.tail] = value;

        return true;
    }

    dequeue(): boolean {
        if (this.isEmpty()) {
            return false;
        }

        if (this.head == this.tail) {
            this.head = -1;
            this.tail = -1;
            return true;
        }

        this.head = (this.head + 1) % this.size;
        return true;
    }

    first(): T | null {
        if (this.isEmpty()) {
            return null;
        }

        return this.list[this.head];
    }

    last(): T | null {
        if (this.isEmpty()) {
            return null;
        }

        return this.list[this.tail];
    }

    isEmpty(): boolean {
        return this.head === -1;
    }

    isFull(): boolean {
        if (this.isEmpty()) {
            return false;
        }

        return (this.tail + 1) % this.size === this.head;
    }
}
