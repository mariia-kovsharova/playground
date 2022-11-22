import { filter, map, pipe } from './transducers';

describe('Transducers', () => {
    test('map and filter transducer methods', () => {
        // initial value is [1, 2, 3, 4, 5];
        const collection = Array.from({ length: 5 }, (_item: number, index: number) => index + 1);

        // Here is the collection of simple functions
        const increment = (x: number): number => x + 1;
        const isEven = (x: number): boolean => x % 2 === 0;
        const introduce = (x: number): string => `i am ${x}`;

        // Here is the composition of them, or an equivalent of
        // const result = (value: number) => introduce(isEven(increment(value)))
        const complexComposedFunction =
            pipe(
                map(increment),
                filter(isEven),
                map(introduce),
            );

        const whatToDoWithComposedResult = (acc, item) => {
            console.log(acc);
            console.log(item);

            return `${acc}${item};`;
        };

        const composed = complexComposedFunction(whatToDoWithComposedResult);

        const processed = collection.reduce(composed, '');

        const expectedResult = [2, 4, 6].map(x => `i am ${x};`).join('');

        expect(processed).toEqual(expectedResult);
    });
});