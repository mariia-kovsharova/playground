import { filter, map, pipe } from './transducers';

describe('Transducers', () => {
    test('map and filter transducer methods', () => {
        const collection = <number[]>Array.from({ length: 5 }, (_item: number, index: number) => index + 1);

        const increment = (x: number) => x + 1;
        const isEven = (x: number) => x % 2 === 0;
        const introduce = (x: number) => `i am ${x}`;

        const mapIncrement = map(increment);
        const filterIsEven = filter(isEven);
        const mapIntroduce = map(introduce);

        //prettier-ignore
        const doubleEvenNumbersAndMapToString =
            pipe(
                map(increment), // mapIncrement
                filter(isEven), // filterIsEven
                map(introduce) // mapIntroduce
            );

        const process = doubleEvenNumbersAndMapToString((acc, item) => acc.concat(item));

        const transducedCollection = collection.reduce(process, []);

        expect(transducedCollection).toEqual([2, 4, 6].map(x => `i am ${x}`));
    });
});