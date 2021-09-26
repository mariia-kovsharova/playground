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

class LinkedList<T = any> {
    private static readonly Separator = ',';

    private head: Node<T> | null;
    private tail: Node<T> | null;
    private _size: number;

    constructor(items?: Iterable<T>) {
        this.head = null;
        this.tail = null;
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

        if (!this.head || !this.tail) {
            this.head = node;
            this.tail = node;
            this._size += 1;

            return this;
        }

        const currentHead = this.head;
        node.next = currentHead;

        this.head = node;
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

        if (!this.head || !this.tail) {
            this.head = node;
            this.tail = node;
            this._size += 1;

            return this;
        }

        if (index === 0) {
            this.prepend(value);
        } else if (!index || index >= this.size || index < 0) {
            const currentTail = this.tail;
            currentTail.next = node;

            this.tail = node;
            this._size += 1;
        } else {
            let nodeAtIndex: Node<T> = this.head;

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
        if (!this.head || !this.tail) {
            return;
        }

        let currentNode: Node<T> | null = this.head;
        let prevNode: Node<T> | null = null;
        let nextNode: Node<T> | null = null;

        while (currentNode) {
            if (currentNode.value === value) {
                this._size -= 1;

                if (currentNode === this.head && currentNode === this.tail) {
                    this.head = this.tail = null;
                }

                nextNode = currentNode.next;

                if (currentNode === this.head) {
                    this.head = nextNode;
                }

                if (currentNode === this.tail) {
                    this.tail = prevNode;
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
        if (!this.head) {
            return null;
        }

        const value = this.head.value;

        if (this.head === this.tail) {
            this.head = this.tail = null;
            this._size = 0;
            return value;
        }

        this.head = this.head.next;
        this._size -= 1;

        return value;
    }

    /**
     * Удаляет хвостовой узел в списке
     * @returns значение удаленного узла или null, если такого узла нет
     */
    public deleteTail(): T | null {
        if (!this.head || !this.tail) {
            return null;
        }

        const value = this.tail.value;

        if (this.head === this.tail) {
            this.head = this.tail = null;
            this._size = 0;
            return value;
        }

        let beforeNode: Node<T> = this.head;

        while (beforeNode.next && beforeNode.next !== this.tail) {
            beforeNode = beforeNode.next;
        }

        this.tail = beforeNode;
        this._size -= 1;

        return value;
    }

    /**
     * 
     * @returns массив со значениями всех узлов по очереди
     */
    public toArray(): ReadonlyArray<T> {
        const result: Array<T> = [];
        let currentNode: Node<T> | null = this.head;

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
        if (!this.head || !this.tail || this.head === this.tail) {
            return;
        }

        let currentNode: Node<T> | null = this.head;

        let prevNode: Node<T> | null = null;
        let nextNode: Node<T> | null = null;

        while (currentNode) {
            // Следующая нода, которую мы будем рассматривать - нода next от текущей
            nextNode = currentNode.next;

            // Текущий узел должен теперь указывать на предыдущий
            currentNode.next = prevNode;

            // Теперь предыдущим узлом становится текущий
            prevNode = currentNode;

            // Смотрим на бывший "следующий"
            currentNode = nextNode;
        }

        [this.head, this.tail] = [this.tail, this.head];
    }

    /**
     * Удаляет элементы из связанного списка
     */
    public clear(): void {
        if (!this.head || !this.tail) {
            return;
        }

        this.head = this.tail = null;
        this._size = 0;
    }

    public getHead(): T | null {
        return this.head?.value ?? null;
    }

    public getTail(): T | null {
        return this.tail?.value ?? null;
    }

    public *[Symbol.iterator]() {
        let node: Node<T> | null = this.head;
        while (node) {
            yield node.value;
            node = node.next;
        }
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

export { LinkedList };