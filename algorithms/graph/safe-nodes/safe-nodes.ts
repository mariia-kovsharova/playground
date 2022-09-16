function eventualSafeNodes(graph: number[][]): number[] {
    const size = graph.length;

    const visited = new Array(size).fill(null);
    const visiting = new Array(size).fill(false);

    const hasSafe = (current: number): boolean => {
        if (visited[current] !== null) {
            return visited[current];
        }

        if (visiting[current]) {
            return false;
        }

        visiting[current] = true;

        for (const edge of graph[current]) {
            const isSafe = hasSafe(edge);

            // if at least one edge is not safe, we can stop
            if (!isSafe) {
                visiting[current] = false;
                visited[current] = false;

                return false;
            }
        }

        visiting[current] = false;
        visited[current] = true;

        return true;

    }

    for (let i = 0; i < graph.length; i += 1) {
        hasSafe(i);
    }

    const result: number[] = [];
    for (let i = 0; i < size; i += 1) {
        if (visited[i]) {
            result.push(i);
        }
    }

    return result;
}