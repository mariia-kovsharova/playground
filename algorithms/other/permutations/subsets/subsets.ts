export const generateSubsets = <T>(items: T[]): T[][] => {
    const result: T[][] = [];

    for (const i of items) {
        const innerSubsets: T[][] = [[i]];

        for (const prev of result) {
            innerSubsets.push([...prev, i]);
        }

        result.push(...innerSubsets);
    }

    return [[], ...result];
}

export const generateSubsetsBacktracking = <T>(items: T[]): T[][] => {
    const result: T[][] = [];
    const size = items.length;

    const inner = (current: T[], first: number): void => {
        result.push(current.slice());

        for (let i = first; i < size; i += 1) {
            current.push(items[i]);
            inner(current, i + 1);
            current.pop();
        }
    }

    inner([], 0);

    return result;
}