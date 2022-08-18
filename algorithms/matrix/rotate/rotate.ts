export function rotate(matrix: number[][]): number[][] {
    const copy: number[][] = [];
    const n = matrix.length;

    for (let i = 0; i < n; i += 1) {
        copy[i] = matrix[i].slice();
    }

    const half = ~~(n / 2);

    const transpose = (mat: number[][]): void => {
        for (let i = 0; i < n; i += 1) {
            for (let j = i + 1; j < n; j += 1) {
                const tmp = mat[j][i];
                mat[j][i] = mat[i][j];
                mat[i][j] = tmp;
            }
        }
    }

    const reverse = (mat: number[][]): void => {
        for (let i = 0; i < n; i += 1) {
            for (let j = 0; j < half; j += 1) {
                const tmp = mat[i][j];
                mat[i][j] = mat[i][n - j - 1];
                mat[i][n - j - 1] = tmp;
            }
        }
    }

    transpose(copy);
    reverse(copy);

    return copy;
}