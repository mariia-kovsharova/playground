class UnionFind {
    private root: Array<number>;
    private rank: Array<number>;

    constructor(size: number) {
        this.root = Array.from({ length: size }, (_, i) => i);
        this.rank = new Array(size).fill(1);
    }

    find(x: number): number {
        if (x !== this.root[x]) {
            this.root[x] = this.find(this.root[x]);
        }

        return this.root[x];
    }

    union(x: number, y: number): void {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX !== rootY) {
            if (this.rank[rootX] > this.rank[rootY]) {
                this.root[rootY] = rootX;
            } else if (this.rank[rootX] < this.rank[rootY]) {
                this.root[rootX] = rootY;
            } else {
                this.root[rootY] = rootX;
                this.rank[rootX] += 1;
            }
        }
    }

    connected(x: number, y: number): boolean {
        return this.find(x) === this.find(y);
    }
}
