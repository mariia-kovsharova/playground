export function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    const graph = new Map<number, Set<number>>();

    for (const [target, previous] of prerequisites) {
        graph.set(previous, (graph.get(previous) ?? new Set()).add(target));
    }

    const visited = new Set<number>();
    const visiting = new Set<number>();

    const hasCycle = (index: number): boolean => {
        if (visited.has(index)) {
            return false;
        }

        // cycle
        if (visiting.has(index)) {
            return true;
        }

        visiting.add(index);

        const edges = graph.get(index);

        if (edges) {
            for (const edge of edges) {
                if (hasCycle(edge)) {
                    return true;
                }
            }
        }

        visited.add(index);
        visiting.delete(index);

        return false;
    }

    for (const node of graph) {

        if (hasCycle(node[0])) {
            return false;
        }
    }

    return true;

}