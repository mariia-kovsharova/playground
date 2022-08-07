/**
 * O(n * log(n))
 * @param array - the unsorted collection of items
 * @param k - kth index
 * @return kth smallest element in the array
 */
const quickSearch = <T>(array: Array<T>, k: number): T => {

    /* 
        @param array - the collection in which we need to swap elements
        @param firstIndex - the index of the first element to swap
        @param secondIndex - the index of the second element to swap
    */
    const swap = (array: Array<T>, firstIndex: number, secondIndex: number): void => {
        const tmp = array[firstIndex];
        array[firstIndex] = array[secondIndex];
        array[secondIndex] = tmp;
    }

    /* 
        @param array - the collection in which we need to do a partition
        @param start - the index of the beginning of partition slice
        @param end - the index of the end of partition slice
    */
    const partition = (
        array: Array<T>,
        start: number = 0,
        end: number = array.length - 1
    ): number => {
        // we will take the index of the last element as pivot
        const pivot = array[end];
        let partitionIndex = start;

        // every element that less then the pivot stands at the left part
        // of the array and the right part of the array (except the last element)
        // contains elements equal or more than the pivot element

        // so that means that the final partition index is the index
        // when the right part of the partition BEGINS
        for (let i = start; i < end; i += 1) {
            if (array[i] < pivot) {
                swap(array, i, partitionIndex);
                partitionIndex += 1;
            }
        }

        // finally the pivot element stands at the beginning of the
        // right part of the partition (equal or more than the pivot)
        swap(array, partitionIndex, end);

        return partitionIndex;
    }

    /* 
        @param originalArray - the unsorted collection of items
        @param start - the index of the beginning of an unsorted collection
        @param end - the index of the end of an unsorted collection
        @param isRecursive - the flag which tells us to use the original array or its copy
    */
    const inner = (
        originalArray: Array<T>,
        start: number,
        end: number,
        isRecursive: boolean = false): T => {
        // if it is not a recursive call, we should copy the original array
        // to avoid its mutation
        const collection = isRecursive ? originalArray : originalArray.slice();

        const partitionIndex = partition(collection, start, end);

        if (partitionIndex === k) {
            return collection[partitionIndex];
        }

        if (partitionIndex < k) {
            return inner(collection, start, partitionIndex - 1);
        } else {
            return inner(collection, partitionIndex + 1, end);
        }
    }

    return inner(array, 0, array.length - 1);
};

export { quickSearch };
