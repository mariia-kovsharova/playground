function numOfSubarrays(arr: number[], size: number, threshold: number): number {
    let count = 0;

    let current = 0;

    let start = 0;
    let end = 0;

    while (end < arr.length) {
        current += arr[end];
        end += 1;

        if (end >= size) {
            if ((current / size) >= threshold) {
                count += 1;
            }

            current -= arr[start];
            start += 1;
        }
    }

    return count;
}