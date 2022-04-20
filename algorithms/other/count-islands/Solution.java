public class Solution {
    public int m;
    public int n;
    public char[][] g;

    public boolean isLand(char item) {
        return item == '1';
    }

    public void dfs(int i, int j) {
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

    public int numIslands(char[][] grid) {
        this.g = grid;
        this.m = grid.length;
        this.n = grid[0].length;

        int count = 0;
        for (int i = 0; i < m; i += 1) {
            for (int j = 0; j < n; j += 1) {
                char item = grid[i][j];
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