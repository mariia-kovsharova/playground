export function numTilePossibilities(tiles: string): number {
    const map = new Map<string, number>();
    let result = 0;

    // count the total of tiles
    for (const tile of tiles) {
        map.set(tile, (map.get(tile) ?? 0) + 1);
    }

    const dfs = () => {
        for (const [tile, count] of map) {
            // if we have a tile now, we go deeper until we do not have any tile
            if (count > 0) {
                result += 1;
                map.set(tile, count - 1);
                dfs();
                map.set(tile, count);
            }
        }
    }

    dfs();

    return result;
}