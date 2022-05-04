interface IBinaryTree<T> {
    value: T | null;
    left: IBinaryTree<T> | null;
    right: IBinaryTree<T> | null;

    height: () => number;
    leftHeight: () => number;
    rightHeight: () => number;

    add: (value: T) => void;
    traversal: () => T[];

    isBalanced: () => boolean;
}

class BinaryTree<T> implements IBinaryTree<T> {
    public value: T | null;
    public left: IBinaryTree<T> | null;
    public right: IBinaryTree<T> | null;

    constructor(value: T | null = null, left: BinaryTree<T> | null = null, right: BinaryTree<T> | null = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }

    public add(value: T) {
        if (!this.value) {
            this.value = value;
        }

        if (this.value > value) {
            if (!this.left) {
                this.left = new BinaryTree();
            }

            this.left.add(value);

        } else if (this.value < value) {
            if (!this.right) {
                this.right = new BinaryTree();
            }

            this.right.add(value);
        }
    }

    public traversal(): T[] | never {
        if (!this.value) {
            return [];
        }

        return [...(this.left?.traversal() || []), this.value, ...(this.right?.traversal() || [])];

        // const result: T[] = [];

        // if (this.left) {
        //     result.push(...this.left.traversal());
        // }

        // result.push(this.value);

        // if (this.right) {
        //     result.push(...this.right.traversal());
        // }

        // return result;
    }

    height(): number {
        return this.leftHeight() + this.rightHeight() + 1;
    }

    leftHeight(): number {
        if (!this.left) {
            return 0;
        }

        return this.left.leftHeight() + 1;
    }

    rightHeight(): number {
        if (!this.right) {
            return 0;
        }

        return this.right.rightHeight() + 1;
    }

    isBalanced(): boolean {
        // TODO: implement
        throw new Error('Method not implemented');
    }
}

export { BinaryTree };