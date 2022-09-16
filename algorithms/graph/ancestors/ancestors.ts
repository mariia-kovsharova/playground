export function getAncestors(n: number, edges: number[][]): number[][] {
    const graph = new Map<number, number[]>();
    const visited = new Array(n).fill(null);

    for (const [from, to] of edges) {
        const array = graph.get(to) ?? [];
        array.push(from);
        graph.set(to, array);
    }

    const dfs = (node: number): Set<number> => {
        if (visited[node]) {
            return visited[node];
        }

        const answer = new Set<number>();
        const edges = graph.get(node);

        if (edges?.length) {
            for (const edge of edges) {
                const prev = dfs(edge);
                prev.forEach(i => {
                    answer.add(i);
                });
                answer.add(edge);
            }
        }

        visited[node] = answer;
        return answer;
    }

    for (let i = 0; i < n; i += 1) {
        dfs(i);
    }

    for (let i = 0; i < n; i += 1) {
        visited[i] = Array.from(visited[i]);
        visited[i].sort((a, b) => a - b)
    }

    return visited;
}