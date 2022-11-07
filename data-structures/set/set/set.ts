import { LinkedList } from '../../list/linked-list/linked-list';

export class Set<T = number> implements Iterable<T> {
    private list: LinkedList<T>;

    public get size(): number {
        return this.list.size;
    }

    static union<T>(set: Set<T>, ...sets: Array<Set<T>>): Set<T> {
        const unitedSet = new Set(set);

        for (const innerSet of sets) {
            for (const element of innerSet) {
                unitedSet.add(element);
            }
        }

        return unitedSet;
    }

    static intersection<T>(set: Set<T>, ...sets: Array<Set<T>>): Set<T> {
        const result = new Set<T>();

        for (const element of set) {
            const all = sets.every(set => set.has(element));
            if (all) {
                result.add(element);
            }
        }

        return result;
    }

    constructor(items?: Iterable<T>) {
        this.list = new LinkedList<T>(items);
    }

    public add(value: T): Set<T> {
        if (!this.has(value)) {
            this.list.append(value);
        }

        return this;
    }

    public delete(value: T): Set<T> {
        this.list.delete(value);
        return this;
    }

    public has(value: T): boolean {
        let current = this.list.head;

        while (current && current.value !== value) {
            current = current.next;
        }

        return current !== null;
    }

    public toString(): string {
        return this.list.toString();
    }


    public *[Symbol.iterator](): IterableIterator<T> {
        let node = this.list.head;
        while (node) {
            yield node.value;
            node = node.next;
        }
    }
}