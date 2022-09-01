export function exist(board: string[][], word: string): boolean {
    const m = board.length;
    const n = board[0].length;
    const last = word.length - 1;

    const dfs = (i: number, j: number, pointer: number): boolean => {

        if (i < 0 || i >= m || j < 0 || j >= n) {
            return false;
        }

        if (board[i][j] !== word[pointer]) {
            return false;
        }

        if (pointer === last) {
            return true;
        }

        const tmp = board[i][j];
        board[i][j] = '#';

        const newPointer = pointer + 1;
        // top
        const top = dfs(i - 1, j, newPointer);
        // bottom
        const bottom = dfs(i + 1, j, newPointer);
        // left
        const left = dfs(i, j - 1, newPointer);
        // right
        const right = dfs(i, j + 1, newPointer);

        board[i][j] = tmp;

        return top || bottom || left || right;
    }

    for (let i = 0; i < m; i += 1) {
        for (let j = 0; j < n; j += 1) {
            const result = dfs(i, j, 0);

            if (result) {
                return true;
            }
        }
    }

    return false;
}