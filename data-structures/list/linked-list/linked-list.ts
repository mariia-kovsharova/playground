class Node<T = any> {
    public value: T;
    public next: Node<T> | null;

    constructor(value: T, next: Node<T> | null = null) {
        this.value = value;
        this.next = next;
    }

    toString(): string {
        return String(this.value);
    }
}

class LinkedList<T = any> implements Iterable<T> {
    private static readonly Separator = ',';

    private _head: Node<T> | null;
    private _tail: Node<T> | null;
    private _size: number;

    constructor(items?: Iterable<T>) {
        this._head = null;
        this._tail = null;
        this._size = 0;

        this.fromArray(items);
    }

    public get size(): number {
        return this._size;
    }

    /**
     * 
     * @param value значения для узла, который помещается в начало списка
     */
    public prepend(value: T): LinkedList<T> {
        const node = new Node(value);

        if (!this._head || !this._tail) {
            this._head = node;
            this._tail = node;
            this._size += 1;

            return this;
        }

        const currentHead = this._head;
        node.next = currentHead;

        this._head = node;
        this._size += 1;

        return this;
    }

    /**
     * 
     * @param value значение для узла, который добавляется в список
     * @param index - позиция, на которую надо вставлять элемент.
     * Если индекс не указан, элемент просто добавляется в конец списка
     */
    public append(value: T, index?: number): LinkedList<T> {
        const node = new Node(value);

        if (!this._head || !this._tail) {
            this._head = node;
            this._tail = node;
            this._size += 1;

            return this;
        }

        if (index === 0) {
            this.prepend(value);
        } else if (!index || index >= this.size || index < 0) {
            const currentTail = this._tail;
            currentTail.next = node;

            this._tail = node;
            this._size += 1;
        } else {
            let nodeAtIndex: Node<T> = this._head;

            for (let innerIndex = 0; innerIndex < index - 1; innerIndex += 1) {
                nodeAtIndex = nodeAtIndex.next as NonNullable<Node<T>>;
            }

            node.next = nodeAtIndex.next;
            nodeAtIndex.next = node;

            this._size += 1;
        }

        return this;
    }

    /**
     * 
     * @param value значение, узлы с которым необходимо удалить
     */
    public delete(value: T): void {
        if (!this._head || !this._tail) {
            return;
        }

        let currentNode: Node<T> | null = this._head;
        let prevNode: Node<T> | null = null;
        let nextNode: Node<T> | null = null;

        while (currentNode) {
            if (currentNode.value === value) {
                this._size -= 1;

                if (currentNode === this._head && currentNode === this._tail) {
                    this._head = this._tail = null;
                }

                nextNode = currentNode.next;

                if (currentNode === this._head) {
                    this._head = nextNode;
                }

                if (currentNode === this._tail) {
                    this._tail = prevNode;
                }

                if (prevNode) {
                    prevNode.next = nextNode;
                }

                currentNode = nextNode;
            } else {
                prevNode = currentNode;
                currentNode = currentNode.next;
            }
        }

        return;
    }

    /**
     * Удаляет головной узел в списке
     * @returns значение удаленного узла или null, если такого узла нет
     */
    public deleteHead(): T | null {
        if (!this._head) {
            return null;
        }

        const value = this._head.value;

        if (this._head === this._tail) {
            this._head = this._tail = null;
            this._size = 0;
            return value;
        }

        this._head = this._head.next;
        this._size -= 1;

        return value;
    }

    /**
     * Удаляет хвостовой узел в списке
     * @returns значение удаленного узла или null, если такого узла нет
     */
    public deleteTail(): T | null {
        if (!this._head || !this._tail) {
            return null;
        }

        const value = this._tail.value;

        if (this._head === this._tail) {
            this._head = this._tail = null;
            this._size = 0;
            return value;
        }

        let beforeNode: Node<T> = this._head;

        while (beforeNode.next && beforeNode.next !== this._tail) {
            beforeNode = beforeNode.next;
        }

        this._tail = beforeNode;
        this._size -= 1;

        return value;
    }

    /**
     * 
     * @returns массив со значениями всех узлов по очереди
     */
    public toArray(): ReadonlyArray<T> {
        const result: Array<T> = [];
        let currentNode: Node<T> | null = this._head;

        while (currentNode) {
            result.push(currentNode.value);
            currentNode = currentNode.next;
        }

        return result;
    }

    /**
     * 
     * @param array итерируемый набор значений типа Т, из которого должны быть добавлены узлы
     * в текущий список
     * @returns связанный список типа Т
     */
    public fromArray(items?: Iterable<T>): LinkedList {
        if (items) {
            for (const value of items) {
                this.append(value);
            }
        }

        return this;
    }

    /**
     * 
     * @returns строковое представление значений узлов в том порядке,
     * в котором они расположены в связанном списке
     */
    public toString(): string {
        return this.toArray().join(LinkedList.Separator);
    }

    /**
     * 
     * Разворачивает список - головной элемент становится хвостовым, и наоборот.
     * Узлы меняют направление
     * 
     */
    public reverse(): void {
        if (!this._head || !this._tail || this._head === this._tail) {
            return;
        }

        let currentNode: Node<T> | null = this._head;

        let prevNode: Node<T> | null = null;

        while (currentNode) {
            // Следующая нода, которую мы будем рассматривать - нода next от текущей
            const tmp = currentNode.next;

            // Текущий узел должен теперь указывать на предыдущий
            currentNode.next = prevNode;

            // Теперь предыдущим узлом становится текущий
            prevNode = currentNode;

            // Смотрим на бывший "следующий"
            currentNode = tmp;
        }

        [this._head, this._tail] = [this._tail, this._head];
    }

    /**
     * Удаляет элементы из связанного списка
     */
    public clear(): void {
        if (!this._head || !this._tail) {
            return;
        }

        this._head = this._tail = null;
        this._size = 0;
    }

    public getHead(): T | null {
        return this._head?.value ?? null;
    }

    public getTail(): T | null {
        return this._tail?.value ?? null;
    }

    public get head(): Node<T> | null {
        return this._head;
    }

    public get next(): Node<T> | null {
        if (this._head) {
            return this._head.next;
        }

        return null;
    }

    public *[Symbol.iterator]() {
        let node: Node<T> | null = this._head;
        while (node) {
            yield node.value;
            node = node.next;
        }
    }

    private validate(): void | never {
        if (this._head && !this._tail) {
            throw new Error('Linked list can not have only head!');
        }

        if (!this._head && this._tail) {
            throw new Error('Linked list can not have only tail!');
        }
    }
}

export { LinkedList, Node };

