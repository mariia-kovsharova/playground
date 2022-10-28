import { Node } from '../../list/linked-list/linked-list';

export class OrderedSet<T = number> implements Iterable<T> {
    private _size: number;

    public head: Node<T> | null;

    public get size(): number {
        return this._size;
    }

    static union<T>(set: OrderedSet<T>, ...sets: Array<OrderedSet<T>>): OrderedSet<T> {
        for (const innerSet of sets) {
            for (const element of innerSet) {
                set.add(element);
            }
        }

        return set;
    }

    static intersection<T>(set: OrderedSet<T>, ...sets: Array<OrderedSet<T>>): OrderedSet<T> {
        if (!sets.length) {
            return set;
        }

        let result = new OrderedSet(set);

        const inner = (set1: OrderedSet<T>, set2: OrderedSet<T>): OrderedSet<T> => {
            let node1 = set1.head;
            let node2 = set2.head;

            const result = new OrderedSet<T>();

            while (node1 && node2) {
                if (node1.value === node2.value) {
                    result.add(node1.value);

                    node1 = node1.next;
                    node2 = node2.next;
                } else if (node1.value < node2.value) {
                    node1 = node1.next;
                    continue;
                } else {
                    node2 = node2.next;
                }
            }

            return result;
        }

        for (const innerSet of sets) {
            result = inner(result, innerSet);
        }

        return result;
    }

    constructor(items?: Iterable<T>) {
        this.head = null;
        this._size = 0;

        if (items) {
            for (const element of items) {
                this.add(element)
            }
        }
    }

    public add(value: T): OrderedSet<T> {
        const node = new Node(value);

        if (!this.head) {
            this.head = node;
            this._size += 1;
            return this;
        }

        let current: Node | null = this.head;

        if (current.value > value) {
            node.next = current;
            this.head = node;
            this._size += 1;
            return this;
        }

        let prev: Node | null = this.head;

        while (current && current.value < value) {
            prev = current;
            current = current.next;
        }

        if (current?.value === value) {
            return this;
        }

        this._size += 1;

        node.next = current;
        prev.next = node;

        return this;
    }

    public delete(value: T): OrderedSet<T> {
        let prev: Node<T> | null = null;
        let current = this.head;

        while (current && current.value !== value) {
            prev = current;
            current = current.next;
        }

        while (current && current.value === value) {
            current = current.next;
            this._size -= 1;
        }

        if (prev) {
            prev.next = current;
        } else {
            this.head = current;
        }

        return this;
    }

    public has(value: T): boolean {
        let current = this.head;

        if (!current || current.value > value) {
            return false;
        }

        while (current) {
            if (current.value === value) {
                return true;
            }

            if (current.value > value) {
                return false;
            }

            current = current.next;
        }

        return false;
    }

    public toString(): string {
        return [...this].join(',');
    }


    public *[Symbol.iterator](): IterableIterator<T> {
        let node = this.head;
        while (node) {
            yield node.value;
            node = node.next;
        }
    }
}