import assert from 'assert';

class Node<T = any> {
    public value: T;
    public previous: Node<T> | null;
    public next: Node<T> | null;

    constructor(value: T, next: Node<T> | null = null, previous: Node<T> | null = null) {
        this.value = value;
        this.next = next;
        this.previous = previous;
    }

    toString(): string {
        return String(this.value);
    }
}

class LinkedList<T = any> {
    private static readonly Separator = ',';

    private head: Node<T> | null;
    private tail: Node<T> | null;
    private _size: number;

    // TODO: создать сразу из items?
    constructor(items?: Iterable<T>) {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }

    get size(): number {
        return this._size;
    }

    /**
     * 
     * @param value значения для узла, который помещается в начало списка
     */
    prepend(value: T): LinkedList<T> {
        const node = new Node(value);

        if (!this.head || !this.tail) {
            this.head = node;
            this.tail = node;
            return this;
        }

        const currentHead = this.head;
        currentHead.previous = node;

        node.next = currentHead;

        this.head = node;
        this._size += 1;

        return this;
    }

    /**
     * 
     * @param value значение для узла, который помещается в конец списка
     */
    append(value: T): LinkedList<T> {
        const node = new Node(value);

        if (!this.head || !this.tail) {
            this.head = node;
            this.tail = node;
            return this;
        }

        const currentTail = this.tail;
        currentTail.next = node;
        node.previous = currentTail;

        this.tail = node;
        this._size += 1;

        return this;
    }

    /**
     * 
     * @param value значение, узлы с которым необходимо удалить
     * // TODO: чекануть жаву
     * возвращает значение последнего удаленного узла (как в Java, но зачем?..)
     */
    delete(value: T): T | null {
        if (!this.head) {
            return null;
        }

        let currentNode: Node<T> | null = this.head;
        let lastDeletedNode: Node<T> | null = null;

        while (currentNode) {
            if (currentNode.value === value) {
                lastDeletedNode = currentNode;

                const nextNode = currentNode.next;

                if (currentNode.previous !== null) {
                    currentNode.previous.next = nextNode;
                }

                if (currentNode === this.head) {
                    this.head = nextNode;
                    this.head!.previous = null;

                    this._size -= 1;
                }

                if (currentNode === this.tail) {
                    this.tail = this.tail.previous;
                    this.tail!.next = null;

                    this._size -= 1;
                }

                currentNode = nextNode;
            } else {
                currentNode = currentNode.next;
            }
        }

        return lastDeletedNode?.value ?? null;
    }

    deleteHead(): T | null {
        if (!this.head) {
            return null;
        }

        const value = this.head.value;

        if (this.head === this.tail) {
            this.head = this.tail = null;
            return value;
        }

        this.head = this.head.next;
        this.head!.previous = null;

        return value;
    }

    deleteTail(): LinkedList<T> {
        throw new Error('Method not implemented');
    }

    /**
     * 
     * @returns возвращает массив со значениями всех узлов по очереди
     */
    toArray(): ReadonlyArray<T> {
        const result: Array<T> = [];
        let currentNode: Node<T> | null = this.head;

        while (currentNode) {
            result.push(currentNode.value);
            currentNode = currentNode.next;
        }

        return result;
    }

    fromArray(array: ReadonlyArray<T>): LinkedList {
        throw new Error('Method not implemented');
    }

    toString(): string {
        return this.toArray().join(LinkedList.Separator);
    }

    reverse(): LinkedList<T> {
        throw new Error('Method not implemented');
    }

    private validate(): void | never {
        if (this.head && !this.tail) {
            throw new Error('Linked list can not have only head!');
        }

        if (!this.head && this.tail) {
            throw new Error('Linked list can not have only tail!');
        }
    }
}

const appendTest = (): void => {
    const list = new LinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);

    assert(list.toString() === '1,2,3');
    assert(list.size === 3);
}

const prependTest = (): void => {
    const list = new LinkedList<number>();
    list.prepend(1);
    list.prepend(2);
    list.prepend(3);

    assert(list.toString() === '3,2,1');
    assert(list.size === 3);
}

const common = (): void => {
    const list = new LinkedList<number>();
    list.append(1);
    list.append(2);
    list.prepend(0);

    console.log(list.size);
    assert(list.size === 3);

    list.append(3);
    list.prepend(2);
    list.append(2);

    console.log(list.size);
    // assert(list.size === 6);

    assert(list.toString() === '2,0,1,2,3,2');

    const v = list.delete(2);

    console.log(list.size);
    assert(list.toString() === '0,1,3');
    assert(list.size === 3);
};

common();

export { LinkedList };