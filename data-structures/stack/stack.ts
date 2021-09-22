export class Stack<T = any> {
    private stack: Array<T>;

    constructor() {
        this.stack = <Array<T>>[];
    }

    get size(): number {
        return this.stack.length;
    }

    public clear(): void {
        this.stack = <Array<T>>[];
    }

    public isEmpty(): boolean {
        return this.stack.length === 0;
    }

    public push(value: T): void {
        this.stack.push(value);
    }

    public pop(): T | never {
        if (this.isEmpty()) {
            throw new Error('Can not pop from empty stack')
        }

        const item = this.stack.pop();
        return item!;
    }

    public peek(): T | never {
        if (this.isEmpty()) {
            throw new Error('Can not get top from empty stack')
        }

        return this.stack[this.size - 1];
    }

    public print(): string {
        return this.stack.toString();
    }
}
