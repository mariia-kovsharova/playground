// set closes way to zero

function updateMatrix(mat: number[][]): number[][] {
    const rows = mat.length;
    const columns = mat[0].length;

    const table = Array(rows);
    for (let i = 0; i < rows; i += 1) {
        table[i] = Array(columns);
    }

    for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < columns; j += 1) {
            if (mat[i][j] === 0) {
                table[i][j] = 0;
            } else {
                const top = mat[i - 1]?.[j] ?? Infinity;
                const bottom = mat[i + 1]?.[j] ?? Infinity;
                const left = mat[i]?.[j - 1] ?? Infinity;
                const right = mat[i]?.[j + 1] ?? Infinity;

                table[i][j] = 1 + Math.min(top, left, bottom, right);
            }
        }
    }

    return table;
}

const big = [[1, 0, 1, 1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 0, 1, 0, 1, 0, 1, 1], [0, 0, 1, 0, 1, 0, 0, 1, 0, 0], [1, 0, 1, 0, 1, 1, 1, 1, 1, 1], [0, 1, 0, 1, 1, 0, 0, 0, 0, 1], [0, 0, 1, 0, 1, 1, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 0, 1, 1], [1, 0, 0, 0, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 0, 1, 0], [1, 1, 1, 1, 0, 1, 0, 0, 1, 1]];
const middle = [[1, 0, 1, 1, 0], [0, 1, 0, 1, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];

updateMatrix(middle);