/**
 * O(n * log(n))
 * @param array the collection of items to sort
 */
const quickSort = <T>(array: Array<T>): Array<T> => {
    /* 
        base case - when the array has a length equal or less than 1,
        that means that it is has already been sorted 
    */
    if (array.length <= 1) {
        return array;
    }

    const middleIndex = Math.floor(array.length / 2);
    const middleElement = array[middleIndex];

    const less = array.filter((i: T): boolean => i < middleElement);
    const middle = array.filter((i: T): boolean => i === middleElement);
    const greather = array.filter((i: T): boolean => i > middleElement);

    return [...quickSort(less), ...middle, ...quickSort(greather)];
};

export { quickSort };

