// Типовая рекурсия

interface Tree<T> {
  value: T;
  left: Tree<T>;
  right: Tree<T>;

  add: (value: number) => void;
  traverse: () => number[];
}

class TreeImpl implements Tree<number> {
  public value: number;
  public left: Tree<number>;
  public right: Tree<number>;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  public add(value: number) {
    if (this.value < value) {
      if (this.left === null) {
        this.left = new TreeImpl(value);
      } else {
        this.left.add(value);
      }
    } else if (this.value > value) {
      if (this.right === null) {
        this.right = new TreeImpl(value);
      } else {
        this.right.add(value);
      }
    }
  }

  public traverse() {
    if (this.left === null) {
      return [this.value];
    }
    if (this.right === null) {
      return [this.value, ...this.left.traverse()];
    }
    return [...this.right.traverse(), this.value, ...this.left.traverse()];
  }
}


const rootNode = new TreeImpl(8);

rootNode.add(5);
rootNode.add(9);
rootNode.add(12);
rootNode.add(14);
rootNode.add(10);
rootNode.add(6);
rootNode.add(3);
rootNode.add(2);
rootNode.add(4);

console.log(JSON.stringify(rootNode.traverse()));