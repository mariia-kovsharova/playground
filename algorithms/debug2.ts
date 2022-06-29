function orangesRotting(grid: number[][]): number {
    const rows = grid.length;
    const columns = grid[0].length;

    let minutes = 0;

    let freshCount = 0;
    const queue: Array<Array<number>> = [];

    for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < columns; j += 1) {
            if (grid[i][j] === 1) {
                freshCount += 1;
            }

            if (grid[i][j] === 2) {
                queue.push([i, j]);
            }
        }
    }

    const mark = (i: number, j: number): void => {
        if (i < 0 || i > rows - 1 || j < 0 || j > columns - 1 || grid[i][j] !== 1) {
            return;
            // return 0;
        }

        grid[i][j] = 2;
        queue.push([i, j]);

        // ну или просто уменьшаем количество
        freshCount -= 1;
        // return 1;
    }

    // до тех пор, пока есть свежие или в очереди есть позиции
    while (freshCount > 0 && queue.length) {
        // const current = queue.shift();
        const queueSize = queue.length;
        // const pos: Array<Array<number>> = [];

        for (let i = 0; i < queueSize; i += 1) {
            const pos = queue.shift();
            const [i, j] = pos!;

            mark(i - 1, j);
            mark(i + 1, j);
            mark(i, j - 1);
            mark(i, j + 1);
            // const t = mark(i - 1, j);
            // const b = mark(i + 1, j);
            // const l = mark(i, j - 1);
            // const r = mark(i, j + 1);

            // freshCount -= t + b + l + r;
        }

        minutes += 1;
    }

    return freshCount ? -1 : minutes;
}

const result = orangesRotting([[2, 1, 1], [1, 1, 0], [0, 2, 1]]);
console.log('result ', result);