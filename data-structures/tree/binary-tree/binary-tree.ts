interface IBinaryTree<T> {
    value: T | null;
    left: IBinaryTree<T> | null;
    right: IBinaryTree<T> | null;

    next: IBinaryTree<T> | null;

    height: () => number;
    leftHeight: () => number;
    rightHeight: () => number;

    insert: (value: T) => void;
    traversal: () => T[];
}

class BinaryTree<T = number> implements IBinaryTree<T> {
    public value: T;
    public left: BinaryTree<T> | null;
    public right: BinaryTree<T> | null;

    next: BinaryTree<T> | null;

    constructor(value: T, left: BinaryTree<T> | null = null, right: BinaryTree<T> | null = null) {
        this.value = value;
        this.left = left;
        this.right = right;

        this.next = null;
    }

    public insert(value: T): void {
        if (this.value > value) {
            if (!this.left) {
                this.left = new BinaryTree(value);
            } else {
                this.left.insert(value);
            }
        } else {
            if (!this.right) {
                this.right = new BinaryTree(value);
            } else {
                this.right.insert(value);
            }
        }
    }

    public traversal(): T[] | never {
        if (this.value === null) {
            return [];
        }

        return [...(this.left?.traversal() || []), this.value, ...(this.right?.traversal() || [])];
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

    static isBalanced<T>(root: BinaryTree<T> | null): boolean {
        return BinaryTree.dfsHeight(root) !== -1;
    }

    private static dfsHeight<T>(root: BinaryTree<T> | null): number {
        if (!root) {
            return 0;
        }

        const left = BinaryTree.dfsHeight(root.left);
        if (left === -1) {
            return -1;
        }

        const right = BinaryTree.dfsHeight(root.right);
        if (right === -1) {
            return -1;
        }

        if (Math.abs(left - right) > 1) {
            return -1;
        }

        return Math.max(left, right) + 1;
    }

    static isValid<T>(root: BinaryTree<T> | null, min: T, max: T): boolean {
        const inner = (tree: BinaryTree<T> | null, min: T, max: T): boolean => {
            if (!tree) {
                return true;
            }

            if (tree.value <= min || tree.value >= max) {
                return false;
            }

            return inner(tree.left, min, tree.value) && inner(tree.right, tree.value, max);
        }

        return inner(root, min, max);
    }

    static delete<T>(root: BinaryTree<T> | null, value: T): BinaryTree<T> | null {
        if (!root) {
            return null;
        }

        if (root.value === value) {
            if (!root.left && !root.right) {
                return null;
            }

            if (!root.left || !root.right) {
                return root.left ? root.left : root.right;
            }

            let temp = root.right;
            while (temp.left) {
                temp = temp.left;
            }

            root.value = temp.value;
            root.right = BinaryTree.delete(root.right, temp.value);

            return root;
        }

        if (root.value > value) {
            root.left = BinaryTree.delete(root.left, value);
        } else {
            root.right = BinaryTree.delete(root.right, value);
        }

        return root;
    }
}

export { BinaryTree };

