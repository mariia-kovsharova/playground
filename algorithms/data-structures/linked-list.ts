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
    prepend(value: T): LinkedList<T> {
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
    append(value: T, index?: number): LinkedList<T> {
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
     * // TODO: чекануть жаву на тему возврата значения последнего
     *  удаленного узла (но зачем?.. это же бессмысленно)
     */
    delete(value: T): void {
        if (!this.head || !this.tail) {
            return;
        }

        let currentNode: Node<T> | null = this.head;

        while (currentNode) {
            if (currentNode.value === value) {
                if (currentNode === this.head && currentNode === this.tail) {
                    this.head = this.tail = null;
                    this._size -= 1;
                }

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
    fromArray(items?: Iterable<T>): LinkedList {
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
        return this.toArray().join(LinkedList.Separator);
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
    list.append(1).append(2).append(3);

    assert(list.toString() === '1,2,3');
    assert(list.size === 3);

    list.append(4, 2);

    assert(list.toString() === '1,2,4,3');

    list.append(5, 0);

    assert(list.toString() === '5,1,2,4,3');

    list.append(6, 5);

    assert(list.toString() === '5,1,2,4,3,6');

    list.append(7, 4);

    assert(list.toString() === '5,1,2,4,7,3,6');

    console.log('SUCCESS appendTest');
}

const prependTest = (): void => {
    const list = new LinkedList<number>();
    list.prepend(1).prepend(2).prepend(3);

    assert(list.toString() === '3,2,1');
    assert(list.size === 3);

    console.log('SUCCESS prependTest');
}

const deleteTest = () => {
    const list = new LinkedList<string>();
    list.append('foo').append('bar').append('baz').append('foo').append('boo');

    assert(list.toString() === 'foo,bar,baz,foo,boo');

    list.delete('foo');

    assert(list.toString() === 'bar,baz,boo');

    const anotherList = new LinkedList<string>();

    assert(anotherList.toString() === '');

    anotherList.delete('baz');

    assert(anotherList.toString() === '');

    anotherList.append('baz');

    assert(anotherList.toString() === 'baz');

    anotherList.delete('baz');

    assert(anotherList.toString() === '');

    console.log('SUCCESS deleteTest');
}

const deleteHeadTest = () => {
    const list = new LinkedList<number>();

    const head1 = list.deleteHead();

    assert(head1 === null);

    list.append(1);
    list.append(2);

    const head2 = list.deleteHead();

    assert(head2 === 1);

    const head3 = list.deleteHead();

    assert(head3 === 2);

    const head4 = list.deleteHead();

    assert(head4 === null);

    console.log('SUCCESS deleteHeadTest');
}

const deleteTailTest = () => {
    const list = new LinkedList<number>();

    const tail1 = list.deleteTail();

    assert(tail1 === null);

    list.append(1);
    list.append(2);

    const tail2 = list.deleteTail();

    assert(tail2 === 2);

    const tail3 = list.deleteTail();

    assert(tail3 === 1);

    const tail4 = list.deleteTail();

    assert(tail4 === null);

    console.log('SUCCESS deleteTailTest');
}

const toArrayTest = () => {
    const list = new LinkedList<number>();
    list.append(1).append(2).append(3).prepend(4);

    const arr = list.toArray();
    const testArr = [4, 1, 2, 3];

    testArr.forEach((item: number, index: number) => {
        assert(item === arr[index]);
    });

    console.log('SUCCESS toArrayTest');
}

const fromArrayTest = () => {
    const array = ['one', 'two', 'three', 'four'];
    const list = new LinkedList<string>();
    list.fromArray(array);

    const fromList = list.toArray();
    array.forEach((item: string, index: number) => {
        assert(item === fromList[index]);
    });

    console.log('SUCCESS fromArrayTest');
}

const reverseTest = () => {
    const list = new LinkedList<number>();
    list.append(1).append(2).append(3).append(4).append(5);

    assert(list.toString() === '1,2,3,4,5');
    assert(list.size === 5);

    list.reverse();

    assert(list.toString() === '5,4,3,2,1');
    assert(list.size === 5);

    console.log('SUCCESS reverseTest');
}

const test = () => {
    appendTest();
    prependTest();
    deleteTest();
    deleteHeadTest();
    deleteTailTest();
    toArrayTest();
    fromArrayTest();
    reverseTest();
}

test();

export { LinkedList };