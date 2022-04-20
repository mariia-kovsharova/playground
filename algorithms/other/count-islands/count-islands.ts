class Solution {
    public m: number;
    public n: number;
    public g: string[][];

    constructor() {
        this.m = 0;
        this.n = 0;
        this.g = [];
    }

    public isLand(item: string): boolean {
        return item === '1';
    }

    public dfs(i: number, j: number): void {
        // if this is the beginning or the end of the matrix
        // or if current item is not a target land (it is water or it is a visited item)
        if (i < 0 || j < 0 || i >= this.m || j >= this.n || !this.isLand(this.g[i][j])) {
            return;
        }

        this.g[i][j] = '2'; // mark current item as visited

        this.dfs(i - 1, j); // search up
        this.dfs(i + 1, j); // search bottom
        this.dfs(i, j - 1); // search left
        this.dfs(i, j + 1); // search right
    }

    public numIslands(grid: string[][]): number {
        this.g = grid;
        this.m = grid.length;
        this.n = grid[0].length;

        let count = 0;
        for (let i = 0; i < this.m; i += 1) {
            for (let j = 0; j < this.n; j += 1) {
                const item = grid[i][j];
                if (this.isLand(item)) {
                    this.dfs(i, j);
                    // if we find at least one item, there is at least one island
                    count += 1;
                }
            }
        }

        return count;
    }
}