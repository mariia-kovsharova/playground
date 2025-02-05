Disjoint Set — is a data structure that provides union (merge two sets into one) and find (search for a set member) methods.

There are 2 ways to implement union and find operations.

1. Quick Find (fast `find`, but slow `union`)
   The main idea is our sets are arrays, where root[i] shows to the root of `i` element;
   • find(p): just returns root[p], O(1).
   • union(p, q): we need to update all elements of `p`, to point to root[q], O(N).

```
class QuickFind {
    // other methods and logic

    find(p: number): number {
        return this.root[p];
    }

    union(p: number, q: number): void {
        const pid = this.find(p);
        const qid = this.find(q);
        if (pid === qid) return;

        for (let i = 0; i < this.root.length; i++) {
            if (this.root[i] === pid) {
                this.root[i] = qid;
            }
        }
    }
}
```

2. Quick Union (fast `union`, but we may have a deep tree => probably slow `find`)
   The idea is to pick the whole child tree and set the parent of the element from the other set element as a parent of the whole child tree.

`union(1,5);`

Before:

```
    0       4
   / \     / \
  1   -   5   6
 / \
2   3

```

After:

```
      4
    / | \
   5  6  0
        |
        1
       / \
      2   3
```

Code:

```
class QuickUnion {
    // other logic

    find(p: number): number {
        while (p !== this.root[p]) {
            p = this.root[p];
        }
        return p;
    }

    union(p: number, q: number): void {
        const rootP = this.find(p);
        const rootQ = this.find(q);
        if (rootP !== rootQ) {
            this.root[rootP] = rootQ;
        }
    }
}
```

3. Improved Quick Union
   To reduce the depth of the tree, use the next 2 approaches:
    - Union by Rank — while union the smaller tree joins to the bigger.
    - Path Compression — while `find` for each node set the root as its parent (via recursion).
