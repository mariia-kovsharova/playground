export function islandPerimeter(grid: number[][]): number {
    const rows = grid.length;
    const cols = grid[0].length;

    const defaultCount = 4;
    let count = 0;

    const dfs = (i: number, j: number): number => {
        if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] === 0) {
            return 0;
        }

        if (grid[i][j] === 2) {
            return 1;
        }

        // mark as processed
        grid[i][j] = 2;

        const top = dfs(i - 1, j);
        const left = dfs(i, j - 1);
        const right = dfs(i, j + 1);
        const bottom = dfs(i + 1, j);

        const edges = defaultCount - (top + left + right + bottom);
        // console.log(`edges for [${i}][${j}]: ${edges}`);

        count += edges;

        // to neighborhood node it is only 1 edge
        return 1;
    }

    for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < cols; j += 1) {
            if (grid[i][j] === 1) {
                dfs(i, j);
            }
        }
    }

    return count;
}