export class Stack<T = any> {
    private stack: Array<T>;

    constructor() {
        this.stack = <Array<T>>[];
    }

    public isEmpty(): boolean {
        return !!this.stack.length;
    }

    public size(): number {
        return this.stack.length;
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

    public print(): string {
        return this.stack.toString();
    }
}
