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

class DoublyLinkedList<T = any> {
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

    get size(): number {
        return this._size;
    }

    /**
     * 
     * @param value значения для узла, который помещается в начало списка
     */
    prepend(value: T): DoublyLinkedList<T> {
        const node = new Node(value);

        if (!this.head || !this.tail) {
            this.head = node;
            this.tail = node;
            this._size += 1;

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
     * @param value значение для узла, который добавляется в список
     * @param index - позиция, на которую надо вставлять элемент.
     * Если индекс не указан, элемент просто добавляется в конец списка
     */
    append(value: T, index?: number): DoublyLinkedList<T> {
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
            node.previous = currentTail;

            this.tail = node;
            this._size += 1;
        } else {
            let nodeAtIndex: Node<T> = this.head;

            for (let innerIndex = 0; innerIndex < index; innerIndex += 1) {
                nodeAtIndex = nodeAtIndex.next as NonNullable<Node<T>>;
            }

            node.next = nodeAtIndex;
            node.previous = nodeAtIndex.previous;

            node.previous!.next = node;
            nodeAtIndex.previous = node;

            this._size += 1;
        }

        return this;
    }

    /**
     * 
     * @param value значение, узлы с которым необходимо удалить
     */
    delete(value: T): void {
        if (!this.head || !this.tail) {
            return;
        }

        let currentNode: Node<T> | null = this.head;
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
                    this.head!.previous = null;
                }

                if (currentNode === this.tail) {
                    this.tail = this.tail.previous;
                    this.tail!.next = null;
                }

                if (currentNode.previous !== null) {
                    currentNode.previous.next = nextNode;
                }

                currentNode = nextNode;
            } else {
                currentNode = currentNode.next;
            }
        }

        return;
    }

    /**
     * Удаляет головной узел в списке
     * @returns значение удаленного узла или null, если такого узла нет
     */
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

    /**
     * Удаляет хвостовой узел в списке
     * @returns значение удаленного узла или null, если такого узла нет
     */
    deleteTail(): T | null {
        if (!this.tail) {
            return null;
        }

        const value = this.tail.value;

        if (this.head === this.tail) {
            this.head = this.tail = null;
            return value;
        }

        this.tail = this.tail.previous;
        this.tail!.next = null;

        return value;
    }

    /**
     * 
     * @returns массив со значениями всех узлов по очереди
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

    /**
     * 
     * @param array итерируемый набор значений типа Т, из которого должны быть добавлены узлы
     * в текущий список
     * @returns связанный список типа Т
     */
    fromArray(items?: Iterable<T>): DoublyLinkedList {
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
    toString(): string {
        return this.toArray().join(DoublyLinkedList.Separator);
    }

    /**
     * 
     * Разворачивает список - головной элемент становится хвостовым, и наоборот.
     * Элементы между головными меняют ссылки на next и previous узлы
     */
    reverse(): void {
        if (!this.head || !this.tail || this.head === this.tail) {
            return;
        }

        let currentNode = this.head.next;

        while (currentNode?.next) {
            const { next, previous } = currentNode;
            currentNode.previous = next;
            currentNode.next = previous;

            currentNode = next;
        }

        const { next } = this.head;
        const { previous } = this.tail;

        [this.head, this.tail] = [this.tail, this.head];

        this.head.previous = null;
        this.head.next = previous;

        this.tail.next = null;
        this.tail.previous = next;
    }
}

export { DoublyLinkedList };